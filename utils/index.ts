import { createClient } from '@supabase/supabase-js';
import { Configuration, OpenAIApi } from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

const config = new Configuration({
  organization: 'org-RokRmPuVelTz0ngpNF9K4bl8',
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const formalize = (text: string) =>
  JSON.stringify(JSON.parse(text.trim().replace(/\n/g, '')));

export async function getJoke(): Promise<string> {
  const { choices } = (await openai
    .createCompletion({
      model: 'text-davinci-003',
      prompt:
        'Tell me a dad joke related to the work environment. The answer should be structured in json format, like this: { "question": QUESTION, "answer": ANSWER }',
      max_tokens: 60,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then(({ data }) => data)) as unknown as {
    choices: { text: string }[];
  };

  const [{ text }] = choices;

  return formalize(text);
}

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

export async function getJokes(): Promise<Joke[]> {
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
