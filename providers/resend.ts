import { Joke } from '@/types';
import { EmailTemplate } from '@/utils/emailTemplate';
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendJoke(joke: Joke): Promise<void> {
  const { error } = await resend.emails.send({
    from: 'Daniel <daniel@dailydadjoke.app>',
    to: ['danielcc.jp@gmail.com'],
    subject: 'Your Daily Dose of Dad Jokes',
    react: EmailTemplate({ joke }),
  });

  if (error) {
    console.error('Error sending joke', error);
    throw new Error('Error sending joke');
  }
}
