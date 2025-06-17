import { supabase } from '@/lib/supabase';

export async function GET() {
  const baseUrl = 'https://ether-core.com';
  
  // Fetch dynamic content from database
  const [
    { data: blogs },
    { data: projects }
  ] = await Promise.all([
    supabase.from('blogs').select('slug, published_at, updated_at').eq('published', true),
    supabase.from('portfolio').select('id, created_at, updated_at')
  ]);

  // Static pages
  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      url: `${baseUrl}/services`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/projects`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/contact`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/privacy`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/cookies`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.3
    }
  ];

  // Dynamic blog pages
  const blogPages = (blogs || []).map((blog: { slug: string; published_at: string; updated_at?: string }) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastmod: blog.updated_at || blog.published_at,
    changefreq: 'monthly',
    priority: 0.6
  }));

  // Dynamic project pages (if you have individual project pages)
  const projectPages = (projects || []).map((project: { id: string; created_at: string; updated_at?: string }) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastmod: project.updated_at || project.created_at,
    changefreq: 'monthly',
    priority: 0.5
  }));

  // Combine all pages
  const allPages = [...staticPages, ...blogPages, ...projectPages];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
} 