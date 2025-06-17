-- ============================================
-- SEO IMAGE OPTIMIZATION FOR BLOGS TABLE
-- ============================================

-- Add SEO image fields to blogs table
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_alt TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_title VARCHAR(200);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_description TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_caption TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_width INTEGER;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_height INTEGER;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_file_size INTEGER; -- in bytes
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_format VARCHAR(20); -- jpg, png, webp
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_seo_score INTEGER DEFAULT 0; -- 0-100

-- Create index for image SEO scoring
CREATE INDEX IF NOT EXISTS idx_blogs_image_seo_score ON blogs(image_seo_score);

-- ============================================
-- POPULATE EXISTING BLOGS WITH SEO IMAGE DATA
-- ============================================

-- Generate image alt text based on blog title and content
UPDATE blogs SET 
    image_alt = CASE 
        WHEN image_url IS NOT NULL AND image_alt IS NULL THEN 
            title || ' - ' || SUBSTRING(content, 1, 100)
        ELSE image_alt
    END,
    image_title = CASE 
        WHEN image_url IS NOT NULL AND image_title IS NULL THEN 
            title
        ELSE image_title
    END,
    image_description = CASE 
        WHEN image_url IS NOT NULL AND image_description IS NULL THEN 
            'Featured image for: ' || title
        ELSE image_description
    END,
    image_caption = CASE 
        WHEN image_url IS NOT NULL AND image_caption IS NULL THEN 
            NULL -- Leave empty for now
        ELSE image_caption
    END,
    -- Default dimensions for blog images (can be updated later)
    image_width = CASE 
        WHEN image_url IS NOT NULL AND image_width IS NULL THEN 1200
        ELSE image_width
    END,
    image_height = CASE 
        WHEN image_url IS NOT NULL AND image_height IS NULL THEN 675
        ELSE image_height
    END,
    -- Extract format from URL (basic detection)
    image_format = CASE 
        WHEN image_url IS NOT NULL AND image_format IS NULL THEN 
            CASE 
                WHEN image_url ILIKE '%.jpg' OR image_url ILIKE '%.jpeg' THEN 'jpg'
                WHEN image_url ILIKE '%.png' THEN 'png'
                WHEN image_url ILIKE '%.webp' THEN 'webp'
                ELSE 'jpg'
            END
        ELSE image_format
    END,
    -- Calculate basic SEO score
    image_seo_score = CASE 
        WHEN image_url IS NOT NULL THEN
            (CASE WHEN LENGTH(COALESCE(title, '')) > 0 THEN 25 ELSE 0 END) +
            (CASE WHEN LENGTH(COALESCE(title || ' - ' || SUBSTRING(content, 1, 100), '')) > 0 THEN 25 ELSE 0 END) +
            (CASE WHEN LENGTH(COALESCE('Featured image for: ' || title, '')) > 0 THEN 25 ELSE 0 END) +
            25 -- Base score for having an image
        ELSE 0
    END
WHERE image_alt IS NULL OR image_seo_score = 0;

-- ============================================
-- UPDATE SCHEMA MARKUP WITH IMAGE SEO DATA
-- ============================================

-- Update blog schema to include enhanced image data
UPDATE blogs SET schema_data = jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', 'BlogPosting',
    'headline', title,
    'description', excerpt,
    'image', jsonb_build_object(
        '@type', 'ImageObject',
        'url', image_url,
        'width', COALESCE(image_width, 1200),
        'height', COALESCE(image_height, 675),
        'alt', COALESCE(image_alt, title),
        'description', COALESCE(image_description, 'Featured image for: ' || title)
    ),
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
    'keywords', COALESCE(
        ARRAY_TO_STRING(tags, ', '),
        category
    )
) WHERE image_url IS NOT NULL;

-- ============================================
-- CREATE HELPFUL VIEWS FOR IMAGE SEO
-- ============================================

-- View for image SEO analysis
CREATE OR REPLACE VIEW blog_image_seo_analysis AS
SELECT 
    id,
    title,
    image_url,
    image_alt,
    image_title,
    image_description,
    image_seo_score,
    CASE 
        WHEN image_url IS NULL THEN 'No Image'
        WHEN image_seo_score >= 80 THEN 'Excellent'
        WHEN image_seo_score >= 60 THEN 'Good'
        WHEN image_seo_score >= 40 THEN 'Needs Improvement'
        ELSE 'Poor'
    END as seo_status,
    -- SEO recommendations
    CASE 
        WHEN image_url IS NULL THEN 'Add a featured image'
        WHEN image_alt IS NULL OR LENGTH(image_alt) < 10 THEN 'Improve alt text'
        WHEN image_title IS NULL THEN 'Add image title'
        WHEN image_description IS NULL THEN 'Add image description'
        ELSE 'Image SEO is optimized'
    END as recommendation
FROM blogs
ORDER BY image_seo_score DESC;

-- View for sitemap image extensions
CREATE OR REPLACE VIEW sitemap_images AS
SELECT 
    '/blog/' || slug as page_url,
    image_url,
    COALESCE(image_alt, title) as alt_text,
    COALESCE(image_title, title) as title,
    COALESCE(image_caption, image_description) as caption
FROM blogs 
WHERE image_url IS NOT NULL AND slug IS NOT NULL;

COMMIT; 