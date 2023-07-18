'use client';
import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSWR, { Fetcher } from 'swr';
import { FaGithub, FaArrowRight } from 'react-icons/fa';
import ContentLoader from 'react-content-loader';

import { Joke } from '@/utils';

export const revalidate = 0;

const fetcher: Fetcher<
  unknown,
  {
    url: string;
    options: RequestInit;
  }
> = ({ url, options }) => fetch(url, options).then((res) => res.json());

export default function Home() {
  const [showAnswer, setShowAnswer] = useState(false);

  const { data: joke } = useSWR(
    {
      url: '/api/supabase/joke',
      options: {
        cache: 'no-store',
      },
    },
    fetcher
  ) as unknown as {
    data: Joke;
  };

  const { data: jokes } = useSWR(
    {
      url: `/api/supabase/jokes`,
      options: {
        cache: 'no-store',
      },
    },
    fetcher
  ) as unknown as {
    data: Joke[];
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      <header className="flex w-full items-center justify-between py-4 px-16 bg-blue-background text-white font-light border-b border-black">
        <h1 className="flex items-center gap-4">
          <Image
            src="/favicon.ico"
            width={24}
            height={24}
            alt="Daily dad joke favicon"
          />
          The Daily Dad Joke
        </h1>
        <div className="flex items-center gap-16">
          <Link className="hover:text-slate-300" href="#jokes">
            Jokes
          </Link>
          <a
            className="hover:text-slate-300"
            href="https://github.com/danicunhac/daily-dad-joke#contact"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </a>
          <a
            className="hover:text-slate-300"
            href="https://github.com/danicunhac/daily-dad-joke#contributing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contribute
          </a>
          <a
            href="https://github.com/danicunhac/daily-dad-joke"
            className="flex items-center group rounded-lg border border-transparent transition-colors self-end"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={`flex items-center gap-1 text-2xl font-semibold`}>
              <FaGithub size={24} />
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                <FaArrowRight size={15} />
              </span>
            </h2>
          </a>
        </div>
      </header>
      <section className="flex w-full max-w-1920 py-24 px-16 bg-blue-background text-white gap-24 bg-[url('/dad-emoji.svg')] bg-no-repeat bg-[right_bottom_-5rem] border-b border-black">
        <div className="flex flex-1 flex-col max-w-500">
          <h2 className={`mb-6 text-7xl font-serif`}>
            AI Generated Dad Jokes.{' '}
          </h2>
          <p className="text-3xl font-light mb-12">
            Cause dads are funny, right?
          </p>
          <button
            onClick={() => {
              setShowAnswer(true);
            }}
            className="w-fit py-2 px-10 bg-white rounded-3xl text-black border border-black hover:bg-gray-200"
          >
            Make me laugh
          </button>
        </div>
        {joke ? (
          <div className="flex flex-1 flex-col py-4 gap-8 max-w-850">
            <p className="text-3xl font-semibold">{`${joke?.content?.question}`}</p>
            {showAnswer ? (
              <p className="italic text-3xl font-normal text-slate-300">
                {`${joke?.content?.answer}`}{' '}
                <span className="text-slate-300">- Dad</span>
              </p>
            ) : null}
          </div>
        ) : (
          <ContentLoader
            speed={2}
            width={500}
            height={150}
            viewBox="0 0 500 150"
            backgroundColor="#f3f3f375"
            foregroundColor="#ecebeb75"
          >
            <rect x="18" y="23" rx="3" ry="3" width="450" height="11" />
            <rect x="18" y="48" rx="3" ry="3" width="350" height="11" />
          </ContentLoader>
        )}
      </section>
      <section id="jokes" className="py-20 px-16 flex-1 w-full">
        {Array.isArray(jokes) ? (
          <ol className="grid gap-24 grid-cols-3">
            {jokes.map(({ id, created_at, content }, index) => {
              return (
                <li className="flex gap-6" key={id}>
                  <span className="text-3xl	text-teal-500/50 font-bold">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex flex-1 flex-col justify-center max-w-850 gap-2">
                      <p className="text-black font-semibold">{`${content.question}`}</p>
                      <p className="text-black/75 font-normal">
                        {`${content.answer}`}{' '}
                      </p>
                      <time className="text-sm font-normal leading-none text-gray-500">
                        {created_at}
                      </time>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <ContentLoader
            speed={2}
            width={500}
            height={150}
            viewBox="0 0 500 150"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="57" y="18" rx="3" ry="3" width="140" height="11" />
            <rect x="60" y="58" rx="3" ry="3" width="100" height="11" />
            <rect x="58" y="36" rx="3" ry="3" width="140" height="11" />
            <circle cx="25" cy="35" r="19" />
          </ContentLoader>
        )}
      </section>
    </main>
  );
}
