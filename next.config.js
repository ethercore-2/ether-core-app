/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://ejoimfdulvukutxdznem.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqb2ltZmR1bHZ1a3V0eGR6bmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNjU3MjQsImV4cCI6MjA1MzY0MTcyNH0.U0VitAvsr4cMws-AjdcnCweo7EFp241CtVTq1j5Q-2g'
  },
  images: {
    // Enhanced image optimization settings
    formats: ['image/webp', 'image/avif'], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // More breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Thumbnail sizes
    minimumCacheTTL: 60, // Cache optimized images for 60 seconds
    dangerouslyAllowSVG: true, // Allow SVG optimization (if needed)
    contentDispositionType: 'attachment', // Security for SVGs
    domains: [
      'ejoimfdulvukutxdznem.supabase.co',
      'images.unsplash.com', // if you're using Unsplash images
      'via.placeholder.com',  // if you're using placeholder images
      'blog-ether.b-cdn.net' // Bunny CDN for blog images
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ejoimfdulvukutxdznem.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'blog-ether.b-cdn.net',
        port: '',
        pathname: '/**',
      },
    ],
  }
}

module.exports = nextConfig 