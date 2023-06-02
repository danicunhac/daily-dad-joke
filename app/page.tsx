export const revalidate = 60; // 1 hour

import {
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaArrowRight,
} from 'react-icons/fa';

import { getJokes, getTodaysJoke } from './api/supabase';
import Image from 'next/image';

export default async function Home() {
  const joke = await getTodaysJoke();
  const allJokes = await getJokes(joke);

  const shareMessage = joke.trim() + '\n\n - Shared from The Daily Dad Joke';

  return (
    <main className="flex min-h-screen flex-col items-center px-24">
      <header className="flex w-full items-center justify-between py-4 px-8 bg-blue-background text-white font-light border-b border-black">
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
          <a
            href="https://github.com/danicunhac/daily-dad-joke"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jokes
          </a>
          <a
            href="https://github.com/danicunhac/daily-dad-joke"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </a>
          <a
            href="https://github.com/danicunhac/daily-dad-joke"
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
      <section className="flex w-full items-center py-28 bg-blue-background text-white">
        <div className="flex flex-col">
          <h2 className={`mb-3 text-4xl font-semibold`}>
            AI Generated Dad Jokes.{' '}
          </h2>
          <p className="opacity-50">Cause dads are funny, right? </p>
          <p className="italic mt-24">{`"${joke.trim()}" - Dad`}</p>
        </div>
      </section>
      {allJokes ? (
        <ol className="relative border-l border-gray-200 dark:border-gray-700 self-end mt-24">
          {allJokes.reverse().map(({ id, created_at, joke }, index) => (
            <li
              key={id}
              className={`mb-10 ml-4 ${index === 0 ? 'mt-12' : 'mt-16'}`}
            >
              <div className="absolute w-3 h-3 bg-white rounded-full mt-4 -left-1.5 border border-black"></div>
              <time className="mb-1 text-xs font-normal leading-none text-gray-500">
                {new Date(created_at).toDateString()}
              </time>
              <p className="mb-4 text-xs font-normal text-gray-700">
                {joke.trim()}
              </p>
              {/* Share links */}
              <div className="flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    shareMessage
                  )}`}
                  className="inline-flex items-center px-4 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-red-700 focus:z-10 hover:ring-1 focus:outline-none hover:ring-red-700 focus:text-red-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on Twitter
                  <FaTwitter className="ml-1" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    'https://daily-dad-joke.vercel.app/'
                  )}`}
                  className="inline-flex items-center px-4 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-red-700 focus:z-10 hover:ring-1 focus:outline-none hover:ring-red-700 focus:text-red-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on Facebook
                  <FaFacebook className="ml-1" />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    'https://daily-dad-joke.vercel.app/'
                  )}&title=${encodeURIComponent(shareMessage)}`}
                  className="inline-flex items-center px-4 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-red-700 focus:z-10 hover:ring-1 focus:outline-none hover:ring-red-700 focus:text-red-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on LinkedIn
                  <FaLinkedin className="ml-1" />
                </a>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </main>
  );
}
