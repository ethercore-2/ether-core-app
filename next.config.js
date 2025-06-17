/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://ejoimfdulvukutxdznem.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqb2ltZmR1bHZ1a3V0eGR6bmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNjU3MjQsImV4cCI6MjA1MzY0MTcyNH0.U0VitAvsr4cMws-AjdcnCweo7EFp241CtVTq1j5Q-2g'
  },
  images: {
    domains: [
      'ejoimfdulvukutxdznem.supabase.co',
      'images.unsplash.com', // if you're using Unsplash images
      'via.placeholder.com'  // if you're using placeholder images
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ejoimfdulvukutxdznem.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  }
}

module.exports = nextConfig 