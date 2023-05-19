import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
  organization: 'org-RokRmPuVelTz0ngpNF9K4bl8',
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);
