/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'blue-background': '#0D3B66',
        'blue-foreground': '#C0E0DE',
        'gray-foreground-light': '#8D818D',
      },
      maxWidth: {
        500: '500px',
        850: '850px',
        1920: '1920px',
      },
    },
  },
  plugins: [],
};
