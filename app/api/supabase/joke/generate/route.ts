import { generateJokeOfTheDay } from '@/utils';

export const revalidate = 0;

export async function GET(): Promise<Response> {
  try {
    const newJoke = await generateJokeOfTheDay();

    return new Response(JSON.stringify(newJoke), { status: 200 });
  } catch (err) {
    console.error('Error getting joke of the day', err);
    return new Response('Error getting joke of the day', { status: 500 });
  }
}
