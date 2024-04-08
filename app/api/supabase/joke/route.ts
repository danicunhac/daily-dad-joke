import { generateJokeOfTheDay, getJokes } from '@/utils';

export const revalidate = 0;

export async function GET(): Promise<Response> {
  try {
    const jokes = await getJokes();

    return new Response(JSON.stringify(jokes), { status: 200 });
  } catch (err) {
    console.error('Error getting joke', err);
    return new Response('Error getting joke', { status: 500 });
  }
}

// create route to get generate joke of the day
export async function POST(): Promise<Response> {
  try {
    const newJoke = await generateJokeOfTheDay();

    return new Response(JSON.stringify(newJoke), { status: 200 });
  } catch (err) {
    console.error('Error getting joke of the day', err);
    return new Response('Error getting joke of the day', { status: 500 });
  }
}
