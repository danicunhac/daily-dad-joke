import { generateJokeOfTheDay } from '@/utils';

export const revalidate = 0;

export async function GET(): Promise<Response> {
  console.log('GET /api/supabase/joke/generate');

  try {
    const newJoke = await generateJokeOfTheDay();

    return new Response(JSON.stringify(newJoke), { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error getting joke of the day', err.message);
    }
    return new Response('Error getting joke of the day', { status: 500 });
  }
}
