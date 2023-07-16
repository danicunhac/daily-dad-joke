import { getTodaysJoke } from '../utils';

export async function GET(req: Request): Promise<Response> {
  try {
    const joke = await getTodaysJoke();

    console.log('🚀 ~ file: route.ts:7 ~ GET ~ joke:', joke);

    return new Response(joke, { status: 200 });
  } catch (err) {
    console.error('Error getting joke', err);
    return new Response('Error getting joke', { status: 500 });
  }
}
