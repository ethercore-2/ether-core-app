-- ============================================
-- CAMPAIGN VIDEOS TABLE SETUP AND POLICIES
-- ============================================

-- Add additional columns if needed for the campaign videos table
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS video_duration INTEGER; -- Duration in seconds
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS video_thumbnail_url TEXT; -- Custom thumbnail
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS autoplay BOOLEAN DEFAULT FALSE; -- Auto-play setting
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS muted BOOLEAN DEFAULT TRUE; -- Muted by default
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS loop_video BOOLEAN DEFAULT FALSE; -- Loop setting
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS video_type VARCHAR(50) DEFAULT 'promotional'; -- Type of video
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 1; -- Display priority
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE; -- Active status
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add SEO and structured data columns
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70); -- SEO title
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160); -- SEO description
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS video_schema JSONB; -- VideoObject schema
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS video_keywords TEXT; -- Video keywords for SEO

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_campaign_videos_active ON campaign_videos(is_active);
CREATE INDEX IF NOT EXISTS idx_campaign_videos_priority ON campaign_videos(priority);
CREATE INDEX IF NOT EXISTS idx_campaign_videos_type ON campaign_videos(video_type);
CREATE INDEX IF NOT EXISTS idx_campaign_videos_page_slug ON campaign_videos(page_slug);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on campaign_videos table
ALTER TABLE campaign_videos ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (anyone can view active videos)
CREATE POLICY "Public can view active campaign videos"
ON campaign_videos FOR SELECT
USING (is_active = true);

-- Policy for authenticated users to view all videos
CREATE POLICY "Authenticated users can view all campaign videos"
ON campaign_videos FOR SELECT
TO authenticated
USING (true);

-- Policy for authenticated users to insert videos
CREATE POLICY "Authenticated users can insert campaign videos"
ON campaign_videos FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy for authenticated users to update videos
CREATE POLICY "Authenticated users can update campaign videos"
ON campaign_videos FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy for authenticated users to delete videos
CREATE POLICY "Authenticated users can delete campaign videos"
ON campaign_videos FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- SAMPLE DATA FOR CAMPAIGN VIDEOS
-- ============================================

-- Insert sample campaign video data if table is empty
INSERT INTO campaign_videos (
    page_slug, 
    video_url, 
    header_text, 
    subtitle_text, 
    cta_button_text, 
    cta_button_url,
    video_type,
    priority,
    autoplay,
    muted,
    meta_title,
    meta_description,
    video_keywords,
    video_schema
) 
SELECT 
    'campaign-web',
    'https://www.youtube.com/embed/sample-video-id',
    'Transform Your Vision into Reality with EtherCore',
    'Expert Web Development & AI Automation - Schedule Your Free Consultation',
    'Schedule Your Free Consultation',
    'https://calendly.com/ethercore/consultation',
    'promotional',
    1,
    false,
    true,
    'EtherCore Web Development Services - Free Consultation',
    'Transform your business with professional web development and AI automation services. Schedule your free consultation today.',
    'web development, AI automation, digital solutions, free consultation, EtherCore',
    jsonb_build_object(
        '@context', 'https://schema.org',
        '@type', 'VideoObject',
        'name', 'EtherCore Web Development Services',
        'description', 'Professional web development and AI automation services showcase',
        'thumbnailUrl', 'https://img.youtube.com/vi/sample-video-id/maxresdefault.jpg',
        'uploadDate', NOW()::date,
        'duration', 'PT2M30S',
        'publisher', jsonb_build_object(
            '@type', 'Organization',
            'name', 'EtherCore',
            'url', 'https://ether-core.com'
        )
    )
WHERE NOT EXISTS (SELECT 1 FROM campaign_videos WHERE page_slug = 'campaign-web');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get active campaign video for a specific page
CREATE OR REPLACE FUNCTION get_campaign_video(page_slug_param TEXT)
RETURNS TABLE (
    id INTEGER,
    page_slug TEXT,
    video_url TEXT,
    header_text TEXT,
    subtitle_text TEXT,
    cta_button_text TEXT,
    cta_button_url TEXT,
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

-- ============================================
-- UPDATE TRIGGER FOR UPDATED_AT
-- ============================================

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_campaign_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS trigger_update_campaign_videos_updated_at ON campaign_videos;
CREATE TRIGGER trigger_update_campaign_videos_updated_at
    BEFORE UPDATE ON campaign_videos
    FOR EACH ROW
    EXECUTE FUNCTION update_campaign_videos_updated_at();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant necessary permissions for the service role
GRANT SELECT, INSERT, UPDATE, DELETE ON campaign_videos TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;

-- Grant read permissions for anonymous users (public access)
GRANT SELECT ON campaign_videos TO anon;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Query to verify the setup
/*
-- Test the function
SELECT * FROM get_campaign_video('campaign-web');

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'campaign_videos';

-- Check table structure
\d campaign_videos;
*/ 