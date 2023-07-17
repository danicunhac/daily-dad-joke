import { NextRequest } from 'next/server';
import { getJokes } from '../utils';

const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const joke = req.headers.get('joke');

    if (!joke) {
      return new Response('No joke provided', { status: 400 });
    }

    const result = await getJokes(joke);

    const mappedJokes = result.map((joke) => {
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
        id: joke.id,
        created_at,
        joke: JSON.parse(joke.joke),
      };
    });

    return new Response(JSON.stringify(mappedJokes), { status: 200 });
  } catch (err) {
    console.error('Error getting jokes', err);
    return new Response('Error getting jokes', { status: 500 });
  }
}
