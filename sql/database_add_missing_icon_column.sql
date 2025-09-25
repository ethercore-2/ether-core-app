-- =====================================================
-- ADD MISSING CTA_BUTTON_ICON_2 COLUMN
-- =====================================================

-- Add the missing icon column
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS cta_button_icon_2 VARCHAR(50) DEFAULT 'contact';

-- Update existing records with appropriate icons
UPDATE campaign_videos 
SET cta_button_icon_2 = 'contact'
WHERE page_slug IN ('campaign-seo', 'campaign-automation', 'campaign-web');

-- Verify the update
SELECT 
    page_slug,
    cta_button_text_2,
    cta_button_url_2,
    cta_button_icon_2
FROM campaign_videos 
WHERE page_slug IN ('campaign-seo', 'campaign-automation', 'campaign-web')
ORDER BY page_slug;

-- Success message
SELECT 'Missing cta_button_icon_2 column added successfully!' as status; 