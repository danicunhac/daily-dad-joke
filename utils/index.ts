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
  previousJokes?: Joke['content'][]
): Promise<Joke['content']> {
  const prompt = `You're a funny dad, that tells dad jokes.
  Jokes should be structured as a question and an answer in json format like the following: {"question": QUESTION, "answer": ANSWER}. 
  It must not have line breaks and the question and answer must be strings. The jokes should be unique and not repeated.
  Tell me a joke.`;

  if (previousJokes?.length) {
    prompt.concat(
      `Do not repeat the following jokes: ${JSON.stringify(previousJokes)}`
    );
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

export async function generateJokeOfTheDay(
  previousJokes: Joke['content'][]
): Promise<Joke> {
  console.info('Generating joke of the day... previous jokes:', previousJokes);

  const [currentDate] = new Date().toISOString().split('T');

  const jokeOfTheDay = await checkJokeOfTheDay(currentDate);

  if (jokeOfTheDay) {
    return jokeOfTheDay;
  }

  const newJoke = (await getJoke(previousJokes)) as Joke['content'];

  console.info('New joke generated:', newJoke);

  const jokeAlreadyExists = await checkJokeExists(newJoke);

  if (jokeAlreadyExists) {
    console.info('Joke already exists, generating a new one..', newJoke);

    return generateJokeOfTheDay([newJoke, ...previousJokes]);
  }

  const joke = await insertJoke(newJoke, currentDate);

  return joke;
}

export async function checkJokeOfTheDay(
  created_at: string
): Promise<Joke | null> {
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
      console.error(
        'No joke returned from Supabase',
        error.message,
        content,
        created_at
      );
      throw new Error('No joke returned from Supabase');
    }

    return joke as Joke;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error inserting joke', err.message);
    }
    throw new Error('Error inserting joke');
  }
}

const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function getJokes(fields?: string): Promise<Joke[]> {
  try {
    const [today] = new Date().toISOString().split('T');

    const { data: unmappedJokes } = (await supabase
      .from('jokes')
      .select(fields || '*')
      .neq('created_at', today)
      .order('created_at', { ascending: false })) as unknown as {
      data: Joke[];
    };

    let todaysJoke = await checkJokeOfTheDay(today);

    if (!todaysJoke) {
      todaysJoke = await generateJokeOfTheDay(
        unmappedJokes.map((joke) => joke.content)
      );
    }

    unmappedJokes.unshift(todaysJoke);

    const mappedJokes = unmappedJokes.map((joke) => {
      const date = new Date(joke.created_at);

      const created_at = `${weekday[date.getDay()]} · ${date.toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC',
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
    return [
      {
        content: {
          question: 'Why did the daily dad joke cross the road?',
          answer: 'Cause it failed to get jokes!',
        },
        created_at: new Date().toISOString(),
      },
    ];
  }
}

export async function checkJokeExists(joke: Joke['content']): Promise<boolean> {
  const { question } = joke;

  try {
    const { data: joke } = await supabase
      .from('jokes')
      .select()
      .eq('content->>question', question)
      .limit(1)
      .single();

    console.log('Check joke exists result:', joke);

    return !!joke;
  } catch {
    console.error('Error checking joke exists');
    return false;
  }
}
