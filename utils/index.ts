import { getJoke } from '@/providers/openai';
import {
  checkJokeOfTheDay,
  getExistingJokes,
  insertJoke,
} from '@/providers/supabase';
import { Joke } from '@/types';

export const formalize = (text: string) =>
  JSON.parse(text.trim().replace(/\n/g, ''));

export async function getJokes(): Promise<Joke[]> {
  // Check if we have a joke for today
  const currentDate = new Date().toISOString().split('T')[0];

  const existingJokes = await getExistingJokes();

  const jokeOfTheDay = await checkJokeOfTheDay(currentDate);

  if (jokeOfTheDay) {
    return [jokeOfTheDay, ...existingJokes];
  }

  // If not, get a new joke from OpenAI
  const newJoke = (await getJoke(existingJokes)) as Joke['content'];

  const joke = await insertJoke(newJoke, currentDate);

  return [joke, ...existingJokes];
}
