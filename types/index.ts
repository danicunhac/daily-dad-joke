export type Joke = {
  id?: number;
  content: {
    question: string;
    answer: string;
  };
  created_at: string;
};
