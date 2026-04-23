/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URl: process.env.API_URl,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
  },
};

module.exports = nextConfig;
