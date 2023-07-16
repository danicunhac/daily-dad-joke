import { NextRequest, NextResponse } from 'next/server';
import { getJokes } from '../utils';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const joke = req.headers.get('joke');

    console.log('🚀 ~ file: route.ts:8 ~ GET ~ joke:', joke);

    if (!joke) {
      return new Response('No joke provided', { status: 400 });
    }

    const result = await getJokes(joke);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error('Error getting jokes', err);
    return new Response('Error getting jokes', { status: 500 });
  }
}
