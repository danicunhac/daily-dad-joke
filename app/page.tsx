'use client';

import { GithubLogo } from '@phosphor-icons/react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h2 className={`mb-3 text-4xl font-semibold text-red-700`}>
        The Daily Dad Joke
      </h2>
      <p className="italic">
        {`"I'm thinking of reasons to go to Switzerland. The flag is a big plus." - Dad`}
      </p>
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:dark:border-neutral-700gitß"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`flex mb-3 text-2xl font-semibold`}>
            <GithubLogo />
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Check out this project on Github!
          </p>
        </a>
      </div>
    </main>
  );
}
