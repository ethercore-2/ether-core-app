-- =====================================================
-- ADD SECOND CTA FIELDS TO CAMPAIGN_VIDEOS TABLE
-- =====================================================

-- Add second CTA fields to campaign_videos table
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS cta_button_text_2 VARCHAR(100);
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS cta_button_url_2 TEXT;
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS cta_button_icon_2 VARCHAR(50) DEFAULT 'phone';

-- Add comments for the new fields
COMMENT ON COLUMN campaign_videos.cta_button_text_2 IS 'Text for the second CTA button';
COMMENT ON COLUMN campaign_videos.cta_button_url_2 IS 'URL for the second CTA button';
COMMENT ON COLUMN campaign_videos.cta_button_icon_2 IS 'Icon type for the second CTA button (phone, email, calendar, etc.)';

-- =====================================================
-- UPDATE EXISTING RECORDS WITH SECOND CTA DATA
-- =====================================================

-- Update campaign-web page with second CTA
UPDATE campaign_videos 
SET 
    cta_button_text_2 = 'Call: +44 7700 900123',
    cta_button_url_2 = 'tel:+447700900123',
    cta_button_icon_2 = 'phone'
WHERE page_slug = 'campaign-web';

-- Update campaign-seo page with second CTA
UPDATE campaign_videos 
SET 
    cta_button_text_2 = 'Call: +44 7700 900123',
    cta_button_url_2 = 'tel:+447700900123',
    cta_button_icon_2 = 'phone'
WHERE page_slug = 'campaign-seo';

-- Update campaign-automation page with second CTA
UPDATE campaign_videos 
SET 
    cta_button_text_2 = 'Call: +44 7700 900123',
    cta_button_url_2 = 'tel:+447700900123',
    cta_button_icon_2 = 'phone'
WHERE page_slug = 'campaign-automation';

-- =====================================================
-- UPDATE HELPER FUNCTION TO INCLUDE NEW FIELDS
-- =====================================================

-- Update the helper function to include the new CTA fields
CREATE OR REPLACE FUNCTION get_campaign_video(page_slug_param TEXT)
RETURNS TABLE (
    id INTEGER,
    page_slug TEXT,
    video_url TEXT,
    header_text TEXT,
    subtitle_text TEXT,
    cta_button_text TEXT,
    cta_button_url TEXT,
    cta_button_text_2 VARCHAR(100),
    cta_button_url_2 TEXT,
    cta_button_icon_2 VARCHAR(50),
    video_duration INTEGER,
    video_thumbnail_url TEXT,
    autoplay BOOLEAN,
    muted BOOLEAN,
    loop_video BOOLEAN,
    video_type VARCHAR(50),
    priority INTEGER,
    meta_title VARCHAR(70),
    meta_description VARCHAR(160),
    video_schema JSONB,
    video_keywords TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cv.id,
        cv.page_slug,
        cv.video_url,
        cv.header_text,
        cv.subtitle_text,
        cv.cta_button_text,
        cv.cta_button_url,
        cv.cta_button_text_2,
        cv.cta_button_url_2,
        cv.cta_button_icon_2,
        cv.video_duration,
        cv.video_thumbnail_url,
        cv.autoplay,
        cv.muted,
        cv.loop_video,
        cv.video_type,
        cv.priority,
        cv.meta_title,
        cv.meta_description,
        cv.video_schema,
        cv.video_keywords
    FROM campaign_videos cv
    WHERE cv.page_slug = page_slug_param
      AND cv.is_active = true
    ORDER BY cv.priority ASC, cv.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify the updates
SELECT 
    page_slug,
    cta_button_text as primary_cta,
    cta_button_url as primary_url,
    cta_button_text_2 as secondary_cta,
    cta_button_url_2 as secondary_url,
    cta_button_icon_2 as secondary_icon
FROM campaign_videos 
WHERE page_slug IN ('campaign-web', 'campaign-seo', 'campaign-automation')
ORDER BY page_slug;

-- Success message
SELECT 'Second CTA fields added to campaign_videos table successfully!' as status; 