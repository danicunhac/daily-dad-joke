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
      prompt: 'Tell me a random dad joke',
      max_tokens: 60,
      temperature: 0.9,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then(({ data }) => data)) as unknown as {
    choices: { text: string }[];
  };

  const [{ text }] = choices;

  return text;
}
