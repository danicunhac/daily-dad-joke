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

export async function getJoke(previousJoke?: string): Promise<Joke['content']> {
  const prompt = `Tell me a dad joke. 
  The answer must be structured in json format like the following: {"question": QUESTION, "answer": ANSWER}. 
  It must not have line breaks`;

  const { choices } = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      previousJoke
        ? {
            role: 'user',
            content: `${prompt}. It must not be the same as the previous joke: ${previousJoke}`,
          }
        : {
            role: 'user',
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

export async function getTodaysJoke(previousJoke?: string): Promise<Joke> {
  // Check if we have a joke for today
  const currentDate = new Date().toISOString().split('T')[0];

  const jokeOfTheDay = await checkJokeOfTheDay(currentDate);

  if (jokeOfTheDay) {
    return jokeOfTheDay;
  }

  // If not, get a new joke from OpenAI
  const newJoke = (await getJoke(previousJoke)) as Joke['content'];

  // Check if the joke already exists
  const jokeAlreadyExists = await checkJokeExists(newJoke);

  if (jokeAlreadyExists) {
    return getTodaysJoke(JSON.stringify(newJoke));
  }

  const joke = await insertJoke(newJoke, currentDate);

  return joke;
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

async function checkJokeExists(content: Joke['content']): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('jokes')
      .select('content')
      .eq('content', JSON.stringify(content))
      .single();

    return !!data || !!error;
  } catch {
    console.error('Error checking joke exists');
  }

  return false;
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

export async function getExistingJokes(): Promise<Joke[]> {
  const currentDate = new Date().toISOString().split('T')[0];

  try {
    const { data } = (await supabase
      .from('jokes')
      .select()
      .order('created_at', { ascending: false })
      .neq('created_at', currentDate)) as unknown as { data: Joke[] };

    return data;
  } catch {
    console.error('Error getting jokes');
  }

  return [];
}
