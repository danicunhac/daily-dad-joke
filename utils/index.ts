import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

const openai = new OpenAI({
  organization: 'org-RokRmPuVelTz0ngpNF9K4bl8',
  apiKey: process.env.OPENAI_API_KEY,
});

const formalize = (text: string) => JSON.parse(text.trim().replace(/\n/g, ''));

export async function getJoke(
  previousJoke?: Joke['content']
): Promise<Joke['content']> {
  const prompt = `You're a funny dad, that tells dad jokes.
  Jokes should be structured as a question and an answer in json format like the following: {"question": QUESTION, "answer": ANSWER}. 
  It must not have line breaks and the question and answer must be strings. The jokes should be unique and not repeated.`;

  if (previousJoke) {
    prompt.concat(`Do not repeat the last joke: ${previousJoke.question}`);
  }

  const { choices } = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: prompt,
      },
    ],
    temperature: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  const [{ message }] = choices;

  if (!message?.content) {
    throw new Error('No message returned from OpenAI');
  }

  return formalize(message.content);
}

export type Joke = {
  id?: number;
  content: {
    question: string;
    answer: string;
  };
  created_at: string;
};

export async function getJokes(
  previousJoke?: Joke['content']
): Promise<Joke[]> {
  // Check if we have a joke for today
  const [currentDate] = new Date().toISOString().split('T');

  const [jokeOfTheDay, existingJokes] = await Promise.all([
    checkJokeOfTheDay(currentDate),
    getExistingJokes(),
  ]);

  if (jokeOfTheDay) {
    return [jokeOfTheDay, ...existingJokes];
  }

  // If not, get a new joke from OpenAI
  const newJoke = (await getJoke(previousJoke)) as Joke['content'];

  const jokeAlreadyExists = await checkJokeExists(newJoke);

  // Circle back if the joke already exists and send the previous joke so we don't end in an infinite loop
  if (jokeAlreadyExists) {
    return getJokes(newJoke);
  }

  const joke = await insertJoke(newJoke, currentDate);

  return [joke, ...existingJokes];
}

async function checkJokeOfTheDay(created_at: string): Promise<Joke | null> {
  try {
    const { data: joke } = await supabase
      .from('jokes')
      .select()
      .eq('created_at', created_at)
      .single();

    return joke as Joke;
  } catch {
    console.error('Error checking joke of the day');
  }

  return null;
}

async function insertJoke(
  content: Joke['content'],
  created_at: string
): Promise<Joke> {
  try {
    const { data: joke, error } = await supabase
      .from('jokes')
      .insert([
        {
          created_at,
          content,
        },
      ])
      .select()
      .single();

    if (!joke || error) {
      throw new Error('No joke returned from Supabase');
    }

    return joke as Joke;
  } catch (err) {
    console.error('Error inserting joke', err);
    throw new Error('Error inserting joke');
  }
}

const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function getExistingJokes(fields?: string): Promise<Joke[]> {
  const currentDate = new Date().toISOString().split('T')[0];

  try {
    const { data } = (await supabase
      .from('jokes')
      .select(fields || '*')
      .order('created_at', { ascending: false })
      .neq('created_at', currentDate)) as unknown as { data: Joke[] };

    const mappedJokes = data.map((joke) => {
      const date = new Date(joke.created_at);

      const created_at = `${weekday[date.getDay()]} · ${date.toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }
      )}`;

      return {
        ...joke,
        created_at,
      };
    });

    return mappedJokes;
  } catch {
    console.error('Error getting jokes');
    return [];
  }
}

export async function checkJokeExists(joke: Joke['content']): Promise<boolean> {
  const { question, answer } = joke;

  try {
    const { data: joke } = await supabase
      .from('jokes')
      .select()
      .filter('content->>question', 'eq', question)
      .filter('content->>answer', 'eq', answer)
      .single();

    return !!joke;
  } catch {
    console.error('Error checking joke exists');
    return false;
  }
}
