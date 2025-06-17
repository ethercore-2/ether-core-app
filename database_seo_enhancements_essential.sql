-- ============================================
-- ESSENTIAL SEO ENHANCEMENTS FOR EXISTING TABLES
-- ============================================

-- SERVICES TABLE - ESSENTIAL SEO FIELDS ONLY
ALTER TABLE services ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70);
ALTER TABLE services ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160);
ALTER TABLE services ADD COLUMN IF NOT EXISTS slug VARCHAR(100) UNIQUE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS service_category VARCHAR(100);
ALTER TABLE services ADD COLUMN IF NOT EXISTS price_range VARCHAR(50);
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS structured_data JSONB;

-- BLOGS TABLE - ESSENTIAL SEO FIELDS ONLY  
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS reading_time INTEGER;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS author_name VARCHAR(100) DEFAULT 'EtherCore Team';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS schema_data JSONB;

-- PORTFOLIO TABLE - ESSENTIAL SEO FIELDS ONLY
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS slug VARCHAR(100) UNIQUE;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS client_name VARCHAR(100);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS technologies TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS schema_data JSONB;

-- TESTIMONIALS TABLE - ESSENTIAL SEO FIELDS ONLY
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_company VARCHAR(100);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_position VARCHAR(100);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS project_type VARCHAR(100);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS schema_data JSONB;

-- ============================================
-- CREATE ESSENTIAL INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(is_featured);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(is_featured);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);

-- ============================================
-- UPDATE EXISTING DATA WITH PROPER LENGTH LIMITS
-- ============================================

-- Generate slugs and meta data for services (with length limits)
UPDATE services SET 
    slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), '/', '-')),
    meta_title = SUBSTRING(name || ' | EtherCore Services', 1, 70),
    meta_description = SUBSTRING(description, 1, 160),
    service_category = CASE 
        WHEN name ILIKE '%web%' THEN 'Web Development'
        WHEN name ILIKE '%ai%' OR name ILIKE '%automation%' THEN 'AI Automation'  
        WHEN name ILIKE '%seo%' THEN 'SEO Services'
        WHEN name ILIKE '%design%' OR name ILIKE '%ui%' OR name ILIKE '%ux%' THEN 'Design Services'
        ELSE 'Digital Solutions'
    END,
    price_range = '£300-£1000'
WHERE slug IS NULL;

-- Generate slugs and meta data for blogs (with length limits)
UPDATE blogs SET 
    slug = LOWER(REGEXP_REPLACE(REPLACE(title, ' ', '-'), '[^a-z0-9\-]', '', 'g')),
    meta_title = SUBSTRING(title, 1, 70),
    meta_description = CASE 
        WHEN LENGTH(content) > 160 THEN SUBSTRING(content, 1, 157) || '...'
        ELSE content
    END,
    excerpt = CASE 
        WHEN LENGTH(content) > 200 THEN SUBSTRING(content, 1, 197) || '...'
        ELSE content
    END,
    reading_time = GREATEST(1, CEIL(LENGTH(content) / 1000.0)),
    category = CASE 
        WHEN title ILIKE '%web%' OR title ILIKE '%website%' THEN 'Web Development'
        WHEN title ILIKE '%ai%' OR title ILIKE '%automation%' THEN 'AI & Automation'
        WHEN title ILIKE '%seo%' THEN 'SEO Optimization'
        WHEN title ILIKE '%ux%' OR title ILIKE '%design%' THEN 'Design & UX'
        ELSE 'Digital Insights'
    END
WHERE slug IS NULL OR meta_title IS NULL;

-- Generate slugs and meta data for portfolio (with length limits)
UPDATE portfolio SET 
    slug = LOWER(REGEXP_REPLACE(REPLACE(title, ' ', '-'), '[^a-z0-9\-]', '', 'g')),
    meta_title = SUBSTRING(title || ' | EtherCore Portfolio', 1, 70),
    meta_description = SUBSTRING(description, 1, 160),
    category = 'Web Development'
WHERE slug IS NULL;

-- Update testimonials with essential data
UPDATE testimonials SET 
    is_verified = TRUE,
    project_type = 'Web Development'
WHERE is_verified IS NULL;

-- ============================================
-- CREATE ESSENTIAL SCHEMA MARKUP
-- ============================================

-- Update services with basic Service schema
UPDATE services SET structured_data = jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', 'Service',
    'name', name,
    'description', description,
    'provider', jsonb_build_object(
        '@type', 'Organization',
        'name', 'EtherCore'
    ),
    'category', service_category
) WHERE structured_data IS NULL;

-- Update blogs with basic Article schema  
UPDATE blogs SET schema_data = jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', 'BlogPosting',
    'headline', title,
    'description', excerpt,
    'image', image_url,
    'datePublished', published_at,
    'author', jsonb_build_object(
        '@type', 'Organization',  
        'name', COALESCE(author_name, 'EtherCore Team')
    ),
    'publisher', jsonb_build_object(
        '@type', 'Organization',
        'name', 'EtherCore'
    )
) WHERE schema_data IS NULL;

-- Update testimonials with basic Review schema
UPDATE testimonials SET schema_data = jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', 'Review',
    'reviewRating', jsonb_build_object(
        '@type', 'Rating',
        'ratingValue', rating,
        'bestRating', 5
    ),
    'author', jsonb_build_object(
        '@type', 'Person',
        'name', client_name
    ),
    'reviewBody', testimonial
) WHERE schema_data IS NULL;

-- ============================================
-- CREATE SITEMAP VIEW (ESSENTIAL)
-- ============================================

CREATE OR REPLACE VIEW sitemap_urls AS
SELECT 
    '/services/' || slug as url,
    'service' as type,
    created_at as lastmod,
    'weekly' as changefreq,
    '0.8' as priority
FROM services WHERE slug IS NOT NULL
UNION ALL
SELECT 
    '/blog/' || slug as url,
    'blog' as type,
    COALESCE(updated_at, published_at) as lastmod,
    'weekly' as changefreq,
    '0.9' as priority  
FROM blogs WHERE slug IS NOT NULL
UNION ALL
SELECT 
    '/projects/' || slug as url,
    'portfolio' as type,
    created_at as lastmod,
    'monthly' as changefreq,
    '0.7' as priority
FROM portfolio WHERE slug IS NOT NULL; 