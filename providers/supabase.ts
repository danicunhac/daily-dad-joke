import { Joke } from '@/types';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

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

export async function insertJoke(
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
      .neq('created_at', currentDate)
      .limit(100)) as unknown as { data: Joke[] };

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
