-- =====================================================
-- SIMPLE: ADD SECOND CTA COLUMNS
-- =====================================================

-- Add the 2 new columns
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS cta_button_text_2 VARCHAR(100);
ALTER TABLE campaign_videos ADD COLUMN IF NOT EXISTS cta_button_url_2 TEXT;

-- Update existing records with the phone CTA
UPDATE campaign_videos 
SET 
    cta_button_text_2 = 'Call: +44 7700 900123',
    cta_button_url_2 = 'tel:+447700900123'
WHERE page_slug IN ('campaign-web', 'campaign-seo', 'campaign-automation');

-- Done!
SELECT 'Second CTA columns added successfully!' as status; 