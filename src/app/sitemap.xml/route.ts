export async function GET() {
  const baseUrl = 'https://www.ether-core.com';
  
  // Static pages only for now
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
    // Campaign Landing Pages - High Priority
    {
      url: `${baseUrl}/campaign-seo`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/campaign-web`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/campaign-automation`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9
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

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
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