-- ============================================
-- FOOTER ENHANCEMENT - ADD FIGURE LOGO
-- ============================================

-- Add logo_figure column to company_info table
ALTER TABLE company_info ADD COLUMN IF NOT EXISTS logo_figure TEXT;

-- Update existing company info with the figure logo
UPDATE company_info 
SET logo_figure = 'https://ejoimfdulvukutxdznem.supabase.co/storage/v1/object/public/logo_ether//logo_figure_core.png'
WHERE logo_figure IS NULL;

-- Set default value for future inserts
ALTER TABLE company_info ALTER COLUMN logo_figure SET DEFAULT 'https://ejoimfdulvukutxdznem.supabase.co/storage/v1/object/public/logo_ether//logo_figure_core.png';

-- ============================================
-- VERIFICATION QUERY
-- ============================================

-- Verify the updates
SELECT 
    company_name,
    logo_url,
    logo_figure,
    primary_email,
    phone
FROM company_info 
WHERE is_active = true; 