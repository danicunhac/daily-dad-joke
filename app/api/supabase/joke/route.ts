import { getTodaysJoke } from '../utils';

export async function GET(): Promise<Response> {
  try {
    const joke = await getTodaysJoke();

    return new Response(joke, { status: 200 });
  } catch (err) {
    console.error('Error getting joke', err);
    return new Response('Error getting joke', { status: 500 });
  }
}
