import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
  organization: 'org-RokRmPuVelTz0ngpNF9K4bl8',
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getJoke() {
  const { choices } = (await openai
    .createCompletion({
      model: 'text-davinci-003',
      prompt:
        'Tell me a random dad joke. The answer should be structured in json format, like this: { "question": QUESTION, "answer": ANSWER }',
      max_tokens: 60,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then(({ data }) => data)) as unknown as {
    choices: { text: string }[];
  };

  const [{ text }] = choices;

  console.log(
    '🚀 ~ file: index.ts:28 ~ getJoke ~ text:',
    JSON.stringify(JSON.parse(text))
  );

  return JSON.stringify(JSON.parse(text.trim().replace(/\n/g, '')));
}
