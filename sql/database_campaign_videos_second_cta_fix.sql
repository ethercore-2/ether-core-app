-- =====================================================
-- FIX: DROP AND RECREATE CAMPAIGN VIDEO FUNCTION
-- =====================================================

-- Drop the existing function first (as suggested by the error)
DROP FUNCTION IF EXISTS get_campaign_video(text);

-- Now create the updated function with the new CTA fields
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

-- Add comment for the updated function
COMMENT ON FUNCTION get_campaign_video(TEXT) 
IS 'Returns campaign video data including both primary and secondary CTA fields for a specific page slug';

-- Test the function to ensure it works
SELECT 'Testing updated get_campaign_video function...' as status;

-- Test with campaign-seo page
SELECT 
    page_slug,
    cta_button_text as primary_cta,
    cta_button_text_2 as secondary_cta,
    cta_button_icon_2 as secondary_icon
FROM get_campaign_video('campaign-seo');

-- Success message
SELECT 'Campaign video function updated successfully with second CTA fields!' as status; 