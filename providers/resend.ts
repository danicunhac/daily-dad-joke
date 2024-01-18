import { Joke } from '@/types';
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendJoke({ content }: Joke): Promise<void> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'danielcc.jp@gmail.com',
      subject: 'Your Daily Dose of Dad Jokes',
      html: `<p>${content.question}</p><p>${content.answer}</p>`,
    });
  } catch (err) {
    console.error('Error sending joke', err);
    throw new Error('Error sending joke');
  }
}
