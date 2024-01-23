import { Joke } from '@/types';
import { formalize } from '@/utils';
import { OpenAI } from 'openai';

export const openai = new OpenAI({
  organization: 'org-RokRmPuVelTz0ngpNF9K4bl8',
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getJoke(existingJokes: Joke[]): Promise<Joke['content']> {
  const prompt = `Tell me a dad joke. 
    The answer must be structured in json format like the following: {"question": QUESTION, "answer": ANSWER}. 
    It must not have line breaks. It must not be the same as any of the content of the previous jokes ${JSON.stringify(
      existingJokes
    )}`;

  const { choices } = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: prompt,
      },
    ],
    temperature: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  const [{ message }] = choices;

  if (!message?.content) {
    throw new Error('No message returned from OpenAI');
  }

  return formalize(message.content);
}
