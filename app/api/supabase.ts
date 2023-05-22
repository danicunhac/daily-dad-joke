import { createClient } from '@supabase/supabase-js';
import { getJoke } from './openai';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export async function getTodaysJoke() {
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
  const { data } = await supabase
    .from('jokes')
    .select()
    .eq('created_at', created_at);

  if (data && data.length > 0) {
    const [{ joke }] = data;
    return joke;
  }

  return false;
}

async function checkJokeExists(joke: string) {
  const { data } = await supabase.from('jokes').select().eq('joke', joke);

  if (data && data.length > 0) {
    return true;
  }

  return false;
}

async function insertJoke(joke: string, created_at: string) {
  await supabase.from('jokes').insert([
    {
      created_at,
      joke,
    },
  ]);
}
