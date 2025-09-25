-- ============================================
-- SEO ENHANCEMENTS FOR EXISTING TABLES
-- ============================================

-- SERVICES TABLE ENHANCEMENTS
-- Add SEO-specific columns to improve search visibility
ALTER TABLE services ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70);
ALTER TABLE services ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160);
ALTER TABLE services ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS slug VARCHAR(100) UNIQUE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(255);
ALTER TABLE services ADD COLUMN IF NOT EXISTS og_title VARCHAR(70);
ALTER TABLE services ADD COLUMN IF NOT EXISTS og_description VARCHAR(160);
ALTER TABLE services ADD COLUMN IF NOT EXISTS og_image_url TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS structured_data JSONB; -- For Service schema
ALTER TABLE services ADD COLUMN IF NOT EXISTS service_category VARCHAR(100);
ALTER TABLE services ADD COLUMN IF NOT EXISTS price_range VARCHAR(50); -- e.g., "£300-£500"
ALTER TABLE services ADD COLUMN IF NOT EXISTS delivery_time VARCHAR(50); -- e.g., "2-4 weeks"
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- BLOGS TABLE ENHANCEMENTS  
-- Add missing SEO fields for better blog optimization
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160); 
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(255);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS og_title VARCHAR(70);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS og_description VARCHAR(160);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS og_image_url TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS twitter_title VARCHAR(70);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS twitter_description VARCHAR(160);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS excerpt TEXT; -- For meta descriptions and previews
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS reading_time INTEGER; -- Minutes to read
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS author_name VARCHAR(100) DEFAULT 'EtherCore Team';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS author_bio TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS author_image_url TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS category VARCHAR(100); -- 'Web Development', 'AI', 'SEO'
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS schema_data JSONB; -- For Article/BlogPosting schema

-- PORTFOLIO TABLE ENHANCEMENTS
-- Add SEO and project-specific fields
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS slug VARCHAR(100) UNIQUE;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(255);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS og_title VARCHAR(70);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS og_description VARCHAR(160);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS og_image_url TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS client_name VARCHAR(100);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS client_industry VARCHAR(100);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS technologies TEXT; -- JSON array or comma-separated
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS category VARCHAR(100); -- 'E-commerce', 'Corporate', 'Blog'
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS completion_date DATE;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS github_url VARCHAR(255);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS case_study_url VARCHAR(255);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS schema_data JSONB; -- For CreativeWork schema

-- TESTIMONIALS TABLE ENHANCEMENTS  
-- Add fields for rich Review schema and better context
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_company VARCHAR(100);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_position VARCHAR(100);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_image_url TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_website VARCHAR(255);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS project_type VARCHAR(100); -- Which service was provided
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS project_date DATE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS review_title VARCHAR(200);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS schema_data JSONB; -- For Review schema

-- ============================================
-- CREATE INDEXES FOR SEO PERFORMANCE
-- ============================================

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(service_category);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(is_featured);

-- Blogs indexes  
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(is_featured);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published_at);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);

-- Portfolio indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio(is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_completion ON portfolio(completion_date);

-- Testimonials indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_verified ON testimonials(is_verified);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);

-- ============================================
-- UPDATE EXISTING DATA WITH SEO DEFAULTS
-- ============================================

-- Generate slugs for services (you may need to adjust these)
UPDATE services SET 
    slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), '/', '-')),
    meta_title = name || ' - Professional ' || name || ' Services | EtherCore',
    meta_description = SUBSTRING(description, 1, 150) || '...',
    service_category = CASE 
        WHEN name ILIKE '%web%' THEN 'Web Development'
        WHEN name ILIKE '%ai%' OR name ILIKE '%automation%' THEN 'AI Automation'  
        WHEN name ILIKE '%seo%' THEN 'SEO Services'
        WHEN name ILIKE '%design%' OR name ILIKE '%ui%' OR name ILIKE '%ux%' THEN 'Design Services'
        ELSE 'Digital Solutions'
    END,
    price_range = '£300-£1000', -- Default range, adjust as needed
    delivery_time = '2-4 weeks'
WHERE slug IS NULL;

-- Generate slugs for blogs
UPDATE blogs SET 
    slug = LOWER(REGEXP_REPLACE(REPLACE(title, ' ', '-'), '[^a-z0-9\-]', '', 'g')),
    meta_title = title || ' - EtherCore Blog',
    meta_description = CASE 
        WHEN LENGTH(content) > 150 THEN SUBSTRING(content, 1, 150) || '...'
        ELSE content
    END,
    excerpt = CASE 
        WHEN LENGTH(content) > 200 THEN SUBSTRING(content, 1, 200) || '...'
        ELSE content
    END,
    reading_time = CEIL(LENGTH(content) / 1000.0), -- Rough estimate: 1000 chars = 1 minute
    category = CASE 
        WHEN title ILIKE '%web%' OR title ILIKE '%website%' THEN 'Web Development'
        WHEN title ILIKE '%ai%' OR title ILIKE '%automation%' THEN 'AI & Automation'
        WHEN title ILIKE '%seo%' THEN 'SEO Optimization'
        WHEN title ILIKE '%ux%' OR title ILIKE '%design%' THEN 'Design & UX'
        ELSE 'Digital Insights'
    END
WHERE slug IS NULL OR meta_title IS NULL;

-- Generate slugs for portfolio
UPDATE portfolio SET 
    slug = LOWER(REGEXP_REPLACE(REPLACE(title, ' ', '-'), '[^a-z0-9\-]', '', 'g')),
    meta_title = title || ' - Portfolio Case Study | EtherCore',
    meta_description = SUBSTRING(description, 1, 150) || '...',
    category = 'Web Development', -- Default, adjust as needed
    completion_date = created_at::date
WHERE slug IS NULL;

-- Update testimonials with better structure
UPDATE testimonials SET 
    review_title = SUBSTRING(testimonial, 1, 100),
    is_verified = TRUE, -- Assuming existing testimonials are verified
    project_type = 'Web Development' -- Default, adjust as needed
WHERE review_title IS NULL;

-- ============================================
-- CREATE HELPFUL SEO VIEWS
-- ============================================

-- View for featured content across all tables
CREATE OR REPLACE VIEW featured_content AS
SELECT 'service' as content_type, id, name as title, description, slug, created_at, is_featured
FROM services WHERE is_featured = true
UNION ALL
SELECT 'blog' as content_type, id, title, excerpt as description, slug, published_at as created_at, is_featured  
FROM blogs WHERE is_featured = true
UNION ALL
SELECT 'portfolio' as content_type, id, title, description, slug, created_at, is_featured
FROM portfolio WHERE is_featured = true
ORDER BY created_at DESC;

-- View for SEO sitemap generation
CREATE OR REPLACE VIEW sitemap_urls AS
SELECT 
    '/services/' || slug as url,
    'service' as type,
    updated_at as lastmod,
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

-- ============================================
-- SAMPLE STRUCTURED DATA UPDATES
-- ============================================

-- Update services with Service schema
UPDATE services SET structured_data = jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', 'Service',
    'name', name,
    'description', description,
    'provider', jsonb_build_object(
        '@type', 'Organization',
        'name', 'EtherCore'
    ),
    'category', service_category,
    'offers', jsonb_build_object(
        '@type', 'Offer',
        'description', name,
        'priceRange', price_range
    )
) WHERE structured_data IS NULL;

-- Update blogs with Article schema  
UPDATE blogs SET schema_data = jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', 'BlogPosting',
    'headline', title,
    'description', excerpt,
    'image', image_url,
    'datePublished', published_at,
    'dateModified', COALESCE(updated_at, published_at),
    'author', jsonb_build_object(
        '@type', 'Organization',  
        'name', COALESCE(author_name, 'EtherCore Team')
    ),
    'publisher', jsonb_build_object(
        '@type', 'Organization',
        'name', 'EtherCore',
        'logo', jsonb_build_object(
            '@type', 'ImageObject',
            'url', 'https://ejoimfdulvukutxdznem.supabase.co/storage/v1/object/public/logo_ether/logo_name2.png'
        )
    ),
    'keywords', tags
) WHERE schema_data IS NULL;

-- Update testimonials with Review schema
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
    'reviewBody', testimonial,
    'datePublished', created_at
) WHERE schema_data IS NULL; 