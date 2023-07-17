/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URl: process.env.API_URl,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
  },
};

module.exports = nextConfig;
