import { createClient } from '@supabase/supabase-js';
import { getJoke } from '../openai';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export type Joke = {
  id: number;
  joke: string;
  created_at: string;
};

export async function getTodaysJoke(): Promise<string> {
  // Check if we have a joke for today
  const currentDate = new Date().toISOString().split('T')[0];

  const jokeOfTheDay = await checkJokeOfTheDay(currentDate);

  if (jokeOfTheDay) {
    return jokeOfTheDay;
  }

  // If not, get a new joke from OpenAI
  const newJoke = await getJoke();

  // Check if the joke already exists
  const jokeAlreadyExists = await checkJokeExists(newJoke);

  if (jokeAlreadyExists) {
    return getTodaysJoke();
  }

  // Save the joke
  await insertJoke(newJoke, currentDate);

  return newJoke;
}

async function checkJokeOfTheDay(created_at: string) {
  try {
    const { data } = await supabase
      .from('jokes')
      .select()
      .eq('created_at', created_at);

    if (data && data.length > 0) {
      const [{ joke }] = data;
      return joke;
    }
  } catch {
    console.error('Error checking joke of the day');
  }

  return null;
}

async function checkJokeExists(joke: string): Promise<boolean> {
  try {
    const { data } = await supabase.from('jokes').select().eq('joke', joke);

    if (data && data.length > 0) {
      return true;
    }
  } catch {
    console.error('Error checking joke exists');
  }

  return false;
}

async function insertJoke(joke: string, created_at: string): Promise<void> {
  try {
    await supabase.from('jokes').insert([
      {
        created_at,
        joke,
      },
    ]);
  } catch {
    console.error('Error inserting joke');
  }
}

export async function getJokes(currentJoke: string): Promise<Joke[]> {
  try {
    const { data } = (await supabase
      .from('jokes')
      .select()
      .order('created_at', { ascending: false })
      .neq('joke', currentJoke)) as unknown as { data: Joke[] };

    return data;
  } catch {
    console.error('Error getting jokes');
  }

  return [];
}
