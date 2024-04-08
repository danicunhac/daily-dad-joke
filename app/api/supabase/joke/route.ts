import { getJokes } from '@/utils';

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
