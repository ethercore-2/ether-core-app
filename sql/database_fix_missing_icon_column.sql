-- Add the missing cta_button_icon_2 column
ALTER TABLE campaign_videos ADD COLUMN cta_button_icon_2 VARCHAR(50) DEFAULT 'contact';

-- Update all existing records to have the contact icon
UPDATE campaign_videos 
SET cta_button_icon_2 = 'contact'
WHERE cta_button_icon_2 IS NULL;

-- Verify the column was added
SELECT 
    page_slug,
    cta_button_text_2,
    cta_button_url_2,
    cta_button_icon_2
FROM campaign_videos 
WHERE page_slug IN ('campaign-web', 'campaign-seo', 'campaign-automation'); 