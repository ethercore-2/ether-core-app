-- ============================================
-- PORTFOLIO IMAGE SEO OPTIMIZATION
-- ============================================

-- Add image SEO fields to portfolio table
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS image_alt TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS image_title VARCHAR(200);
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS image_description TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS image_caption TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS image_width INTEGER;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS image_height INTEGER;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS image_file_size INTEGER; -- in bytes
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS image_format VARCHAR(20); -- jpg, png, webp
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS image_seo_score INTEGER DEFAULT 0; -- 0-100

-- Create index for image SEO scoring
CREATE INDEX IF NOT EXISTS idx_portfolio_image_seo_score ON portfolio(image_seo_score);

-- ============================================
-- POPULATE EXISTING PORTFOLIO WITH SEO IMAGE DATA
-- ============================================

-- Generate image alt text for portfolio projects
UPDATE portfolio SET 
    image_alt = CASE 
        WHEN image_url IS NOT NULL AND image_alt IS NULL THEN 
            title || ' - EtherCore Portfolio Project - ' || SUBSTRING(description, 1, 80)
        ELSE image_alt
    END,
    image_title = CASE 
        WHEN image_url IS NOT NULL AND image_title IS NULL THEN 
            title || ' - EtherCore Portfolio'
        ELSE image_title
    END,
    image_description = CASE 
        WHEN image_url IS NOT NULL AND image_description IS NULL THEN 
            'Project showcase for ' || title || ' - EtherCore Portfolio'
        ELSE image_description
    END,
    image_caption = CASE 
        WHEN image_url IS NOT NULL AND image_caption IS NULL THEN 
            title || ' - EtherCore Portfolio Project'
        ELSE image_caption
    END,
    -- Default dimensions for portfolio images
    image_width = CASE 
        WHEN image_url IS NOT NULL AND image_width IS NULL THEN 1200
        ELSE image_width
    END,
    image_height = CASE 
        WHEN image_url IS NOT NULL AND image_height IS NULL THEN 675
        ELSE image_height
    END,
    -- Extract format from URL
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
    -- Calculate portfolio image SEO score
    image_seo_score = CASE 
        WHEN image_url IS NOT NULL THEN
            (CASE WHEN LENGTH(COALESCE(title, '')) > 0 THEN 25 ELSE 0 END) +
            (CASE WHEN LENGTH(COALESCE(title || ' - EtherCore Portfolio Project - ' || SUBSTRING(description, 1, 80), '')) > 0 THEN 30 ELSE 0 END) +
            (CASE WHEN LENGTH(COALESCE(title || ' - EtherCore Portfolio', '')) > 0 THEN 25 ELSE 0 END) +
            (CASE WHEN LENGTH(COALESCE(description, '')) > 0 THEN 15 ELSE 0 END) + -- Bonus for having description
            5 -- Base score for having an image
        ELSE 0
    END
WHERE image_alt IS NULL OR image_seo_score = 0;

-- ============================================
-- UPDATE PORTFOLIO SCHEMA WITH IMAGE SEO DATA
-- ============================================

-- Update portfolio schema to include enhanced image data
UPDATE portfolio SET schema_data = jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', 'CreativeWork',
    'name', title,
    'description', description,
    'image', jsonb_build_object(
        '@type', 'ImageObject',
        'url', image_url,
        'width', COALESCE(image_width, 1200),
        'height', COALESCE(image_height, 675),
        'alt', COALESCE(image_alt, title),
        'description', COALESCE(image_description, 'Project showcase for ' || title),
        'caption', image_caption
    ),
    'url', project_url,
    'creator', jsonb_build_object(
        '@type', 'Organization',
        'name', 'EtherCore',
        'url', 'https://ether-core.com'
    ),
    'dateCreated', created_at,
    'genre', 'Web Development',
    'keywords', COALESCE(description, 'portfolio project'),
    -- Add code repository if available (using project_url as fallback)
    'codeRepository', CASE 
        WHEN project_url IS NOT NULL AND project_url ILIKE '%github%' THEN project_url
        ELSE NULL
    END,
    -- Add completion date if available
    'dateCompleted', CASE 
        WHEN created_at IS NOT NULL THEN created_at
        ELSE NULL
    END
) WHERE image_url IS NOT NULL;

-- ============================================
-- CREATE PORTFOLIO IMAGE SEO VIEWS
-- ============================================

-- View for portfolio image SEO analysis
CREATE OR REPLACE VIEW portfolio_image_seo_analysis AS
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
    -- SEO recommendations specific to portfolio
    CASE 
        WHEN image_url IS NULL THEN 'Add a project showcase image'
        WHEN image_alt IS NULL OR LENGTH(image_alt) < 10 THEN 'Improve alt text with project details'
        WHEN image_title IS NULL THEN 'Add image title for better context'
        WHEN image_description IS NULL THEN 'Add project description for context'
        ELSE 'Portfolio image SEO is optimized'
    END as recommendation
FROM portfolio
ORDER BY image_seo_score DESC;

-- View for portfolio sitemap with images
CREATE OR REPLACE VIEW portfolio_sitemap_images AS
SELECT 
    '/projects/' || COALESCE(slug, id::text) as page_url,
    title,
    image_url,
    COALESCE(image_alt, title) as alt_text,
    COALESCE(image_title, title) as title_text,
    COALESCE(image_caption, image_description) as caption
FROM portfolio 
WHERE image_url IS NOT NULL;

-- ============================================
-- PORTFOLIO IMAGE SEO SCORING FUNCTION
-- ============================================

-- Function to recalculate portfolio image SEO scores
CREATE OR REPLACE FUNCTION calculate_portfolio_image_seo_score(portfolio_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    portfolio_record RECORD;
BEGIN
    SELECT * INTO portfolio_record FROM portfolio WHERE id = portfolio_id;
    
    IF portfolio_record.image_url IS NOT NULL THEN
        score := score + 20; -- Base score for having image
        
        -- Alt text quality (most important for accessibility)
        IF portfolio_record.image_alt IS NOT NULL THEN
            IF LENGTH(portfolio_record.image_alt) > 10 AND LENGTH(portfolio_record.image_alt) < 125 THEN
                score := score + 25; -- Good alt text
            ELSE
                score := score + 10; -- Has alt text but needs improvement
            END IF;
        END IF;
        
        -- Title attribute
        IF portfolio_record.image_title IS NOT NULL THEN
            score := score + 15;
        END IF;
        
        -- Description for context
        IF portfolio_record.image_description IS NOT NULL THEN
            score := score + 15;
        END IF;
        
        -- Description context (portfolio-specific)
        IF portfolio_record.description IS NOT NULL AND LENGTH(portfolio_record.description) > 10 THEN
            score := score + 10;
        END IF;
    END IF;
    
    RETURN LEAST(score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql;

COMMIT; 