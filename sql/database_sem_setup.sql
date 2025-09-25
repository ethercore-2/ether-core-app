-- =====================================================
-- SEM PROMO TABLE SETUP
-- =====================================================

-- Create promo_sem table (following promo_web structure)
CREATE TABLE IF NOT EXISTS promo_sem (
    id BIGSERIAL PRIMARY KEY,
    
    -- Basic Information
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    
    -- Pricing Information
    setup_price_amount DECIMAL(10,2) NOT NULL,
    monthly_price_amount DECIMAL(10,2) NOT NULL,
    price_currency VARCHAR(10) DEFAULT 'GBP',
    setup_price_label VARCHAR(100) DEFAULT 'Initial Setup',
    monthly_price_label VARCHAR(100) DEFAULT 'Per Month',
    
    -- CTA Information
    cta_button_text VARCHAR(100) NOT NULL,
    cta_button_url TEXT NOT NULL,
    additional_info TEXT,
    
    -- Benefit Cards (JSON array for flexibility)
    benefits JSONB NOT NULL DEFAULT '[]',
    
    -- Display Settings
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    
    -- Background and Styling (Orange/Red theme for SEM)
    background_gradient VARCHAR(255) DEFAULT 'from-orange-500/10 to-red-500/10',
    price_tag_gradient VARCHAR(255) DEFAULT 'from-orange-300 to-red-400',
    
    -- SEO Fields
    meta_title VARCHAR(255),
    meta_description TEXT,
    schema_data JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Insert SEM promo data
INSERT INTO promo_sem (
    slug,
    title,
    subtitle,
    setup_price_amount,
    monthly_price_amount,
    price_currency,
    setup_price_label,
    monthly_price_label,
    cta_button_text,
    cta_button_url,
    additional_info,
    benefits,
    meta_title,
    meta_description,
    schema_data,
    created_by
) VALUES (
    'google-ads-management',
    'Google Ads Campaign Management',
    'Professional PPC management to drive qualified leads and maximize your ROI',
    300.00,
    400.00,
    'GBP',
    'Initial Setup',
    'Per Month',
    'Start Your Google Ads Campaign',
    'https://calendly.com/ethercore/google-ads-consultation',
    '* Includes campaign setup, keyword research, ad creation, and ongoing optimization. Minimum 3-month commitment.',
    '[
        {
            "icon": "📈",
            "title": "Qualified Leads",
            "description": "Target high-intent customers ready to buy",
            "metric": "2-5x more leads",
            "order": 1
        },
        {
            "icon": "💰",
            "title": "Increased Sales",
            "description": "Convert clicks into paying customers",
            "metric": "Average 300% ROI",
            "order": 2
        },
        {
            "icon": "👀",
            "title": "Brand Visibility",
            "description": "Dominate search results and outrank competitors",
            "metric": "10x more impressions",
            "order": 3
        }
    ]'::jsonb,
    'Google Ads Management - Professional PPC Services | EtherCore',
    'Expert Google Ads campaign management to drive qualified leads and maximize ROI. £300 setup + £400/month for professional PPC management.',
    '{
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Google Ads Campaign Management",
        "description": "Professional PPC management to drive qualified leads and maximize your ROI",
        "brand": {
            "@type": "Brand",
            "name": "EtherCore"
        },
        "offers": [
            {
                "@type": "Offer",
                "name": "Initial Setup",
                "price": "300",
                "priceCurrency": "GBP",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "name": "Monthly Management",
                "price": "400",
                "priceCurrency": "GBP",
                "availability": "https://schema.org/InStock",
                "priceSpecification": {
                    "@type": "RecurringCharge",
                    "frequency": "Monthly"
                }
            }
        ],
        "category": "Google Ads Management Services"
    }'::jsonb,
    'system'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_promo_sem_slug ON promo_sem(slug);
CREATE INDEX IF NOT EXISTS idx_promo_sem_active ON promo_sem(is_active);

-- Add comments for documentation
COMMENT ON TABLE promo_sem IS 'SEM (Search Engine Marketing) campaign promotional content and pricing';
COMMENT ON COLUMN promo_sem.benefits IS 'JSON array of benefit objects with icon, title, description, metric, and order';
COMMENT ON COLUMN promo_sem.setup_price_amount IS 'One-time setup fee for Google Ads campaign';
COMMENT ON COLUMN promo_sem.monthly_price_amount IS 'Monthly management fee for ongoing campaign optimization';

-- Success message
SELECT 'SEM promo table setup completed successfully!' as status; 