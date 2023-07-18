import { getJokes } from '@/utils';

export const revalidate = 0;

const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function GET(): Promise<Response> {
  try {
    const result = await getJokes();

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
        ...joke,
        created_at,
      };
    });

    return new Response(JSON.stringify(mappedJokes), { status: 200 });
  } catch (err) {
    console.error('Error getting jokes', err);
    return new Response('Error getting jokes', { status: 500 });
  }
}
