import Image from 'next/image';
import { getTodaysJoke } from './api/supabase';

export default async function Home() {
  const joke = await getTodaysJoke();

  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-24">
      <a
        href="https://github.com/danicunhac/daily-dad-joke"
        className="group rounded-lg border border-transparent px-5 py-4 transition-colors self-end"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={`flex mb-3 text-2xl font-semibold`}>
          <Image
            src="/ri_github-fill.svg"
            width={24}
            height={24}
            alt="Github Logo"
          />
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
      </a>
      <div className="flex flex-col items-center mt-28">
        <h2 className={`mb-3 text-4xl font-semibold text-red-700`}>
          The Daily Dad Joke
        </h2>
        <p className="opacity-50">
          AI generated Dad joke, one joke a day, cause dads are funny, right?
        </p>
        <p className="italic mt-24">{`"${joke.trim()}" - Dad`}</p>
      </div>
    </main>
  );
}
