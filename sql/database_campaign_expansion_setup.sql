-- =====================================================
-- CAMPAIGN PAGES EXPANSION - DATABASE SETUP
-- =====================================================

-- 1. Add new page slugs to existing campaign_videos table
INSERT INTO campaign_videos (
    page_slug,
    video_url,
    header_text,
    subtitle_text,
    cta_button_text,
    cta_button_url,
    autoplay,
    muted,
    loop_video,
    video_type,
    priority,
    meta_title,
    meta_description,
    video_keywords,
    is_active,
    created_at,
    updated_at
) VALUES 
-- SEO Campaign Video
(
    'campaign-seo',
    'https://example.com/seo-campaign-video.mp4',
    'Dominate Search Rankings with EtherCore SEO',
    'Professional SEO Optimization & Digital Marketing - Boost Your Online Visibility',
    'Get Your Free SEO Audit',
    'https://calendly.com/ethercore/seo-audit',
    false,
    true,
    false,
    'seo_promotional',
    1,
    'SEO Services - Boost Your Search Rankings | EtherCore',
    'Professional SEO optimization services to improve your search rankings and drive organic traffic. Get your free SEO audit today.',
    'SEO optimization, search engine optimization, digital marketing, organic traffic, search rankings, SEO audit',
    true,
    NOW(),
    NOW()
),
-- Automation Campaign Video
(
    'campaign-automation',
    'https://example.com/automation-campaign-video.mp4',
    'Automate Your Business with AI-Powered Solutions',
    'Custom AI Automation & Workflow Optimization - Transform Your Operations',
    'Schedule Automation Consultation',
    'https://calendly.com/ethercore/automation-consultation',
    false,
    true,
    false,
    'automation_promotional',
    1,
    'AI Automation Services - Streamline Your Business | EtherCore',
    'Custom AI automation solutions to streamline your business processes and increase efficiency. Schedule your free consultation.',
    'AI automation, business automation, workflow optimization, artificial intelligence, process automation',
    true,
    NOW(),
    NOW()
);

-- 2. Create promo_seo table (following promo_web structure)
CREATE TABLE IF NOT EXISTS promo_seo (
    id BIGSERIAL PRIMARY KEY,
    
    -- Basic Information
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    price_amount DECIMAL(10,2) NOT NULL,
    price_currency VARCHAR(10) DEFAULT 'GBP',
    price_label VARCHAR(100) DEFAULT 'Starting From',
    
    -- CTA Information
    cta_button_text VARCHAR(100) NOT NULL,
    cta_button_url TEXT NOT NULL,
    additional_info TEXT,
    
    -- Feature Cards (JSON array for flexibility)
    features JSONB NOT NULL DEFAULT '[]',
    
    -- Display Settings
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    
    -- Background and Styling (Green theme for SEO)
    background_gradient VARCHAR(255) DEFAULT 'from-green-500/10 to-emerald-500/10',
    price_tag_gradient VARCHAR(255) DEFAULT 'from-green-300 to-emerald-400',
    
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

-- Insert SEO promo data
INSERT INTO promo_seo (
    slug,
    title,
    subtitle,
    price_amount,
    price_currency,
    price_label,
    cta_button_text,
    cta_button_url,
    additional_info,
    features,
    meta_title,
    meta_description,
    schema_data,
    created_by
) VALUES (
    'seo-audit-package',
    'Complete SEO Audit & Strategy',
    'Comprehensive SEO analysis and optimization roadmap',
    299.00,
    'GBP',
    'Starting From',
    'Get Your Free SEO Audit',
    'https://calendly.com/ethercore/seo-audit',
    '* Includes detailed report, keyword strategy, and 1-hour consultation call.',
    '[
        {
            "icon": "🔍",
            "title": "Technical SEO Audit",
            "description": "Complete website analysis",
            "order": 1
        },
        {
            "icon": "📊",
            "title": "Keyword Research",
            "description": "Target audience analysis",
            "order": 2
        },
        {
            "icon": "📈",
            "title": "Competitor Analysis",
            "description": "Market positioning insights",
            "order": 3
        },
        {
            "icon": "🎯",
            "title": "Content Strategy",
            "description": "SEO-optimized content plan",
            "order": 4
        },
        {
            "icon": "🔗",
            "title": "Link Building",
            "description": "Authority building strategy",
            "order": 5
        },
        {
            "icon": "📱",
            "title": "Local SEO",
            "description": "Google My Business optimization",
            "order": 6
        }
    ]'::jsonb,
    'SEO Audit & Strategy - Boost Your Rankings | EtherCore',
    'Professional SEO audit and strategy package. Get comprehensive analysis, keyword research, and optimization roadmap to dominate search rankings.',
    '{
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Complete SEO Audit & Strategy",
        "description": "Comprehensive SEO analysis and optimization roadmap",
        "brand": {
            "@type": "Brand",
            "name": "EtherCore"
        },
        "offers": {
            "@type": "Offer",
            "price": "299",
            "priceCurrency": "GBP",
            "availability": "https://schema.org/InStock"
        },
        "category": "SEO Services"
    }'::jsonb,
    'system'
);

-- 3. Create promo_automation table (following promo_web structure)
CREATE TABLE IF NOT EXISTS promo_automation (
    id BIGSERIAL PRIMARY KEY,
    
    -- Basic Information
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    price_amount DECIMAL(10,2) NOT NULL,
    price_currency VARCHAR(10) DEFAULT 'GBP',
    price_label VARCHAR(100) DEFAULT 'Starting From',
    
    -- CTA Information
    cta_button_text VARCHAR(100) NOT NULL,
    cta_button_url TEXT NOT NULL,
    additional_info TEXT,
    
    -- Feature Cards (JSON array for flexibility)
    features JSONB NOT NULL DEFAULT '[]',
    
    -- Display Settings
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    
    -- Background and Styling (Purple theme for Automation)
    background_gradient VARCHAR(255) DEFAULT 'from-purple-500/10 to-violet-500/10',
    price_tag_gradient VARCHAR(255) DEFAULT 'from-purple-300 to-violet-400',
    
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

-- Insert Automation promo data
INSERT INTO promo_automation (
    slug,
    title,
    subtitle,
    price_amount,
    price_currency,
    price_label,
    cta_button_text,
    cta_button_url,
    additional_info,
    features,
    meta_title,
    meta_description,
    schema_data,
    created_by
) VALUES (
    'ai-automation-package',
    'AI Business Automation Suite',
    'Custom AI solutions to streamline your operations',
    799.00,
    'GBP',
    'Starting From',
    'Schedule Automation Consultation',
    'https://calendly.com/ethercore/automation-consultation',
    '* Custom pricing based on complexity. Includes implementation and training.',
    '[
        {
            "icon": "🤖",
            "title": "AI Chatbots",
            "description": "24/7 customer support automation",
            "order": 1
        },
        {
            "icon": "📧",
            "title": "Email Automation",
            "description": "Smart email marketing workflows",
            "order": 2
        },
        {
            "icon": "📊",
            "title": "Data Processing",
            "description": "Automated data analysis & reporting",
            "order": 3
        },
        {
            "icon": "🔄",
            "title": "Workflow Automation",
            "description": "Custom business process automation",
            "order": 4
        },
        {
            "icon": "🎯",
            "title": "Lead Generation",
            "description": "AI-powered lead qualification",
            "order": 5
        },
        {
            "icon": "📱",
            "title": "API Integration",
            "description": "Connect all your business tools",
            "order": 6
        }
    ]'::jsonb,
    'AI Business Automation Suite - Streamline Operations | EtherCore',
    'Custom AI automation solutions to streamline your business processes. Chatbots, workflow automation, data processing, and more.',
    '{
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "AI Business Automation Suite",
        "description": "Custom AI solutions to streamline your operations",
        "brand": {
            "@type": "Brand",
            "name": "EtherCore"
        },
        "offers": {
            "@type": "Offer",
            "price": "799",
            "priceCurrency": "GBP",
            "availability": "https://schema.org/InStock"
        },
        "category": "AI Automation Services"
    }'::jsonb,
    'system'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_promo_seo_slug ON promo_seo(slug);
CREATE INDEX IF NOT EXISTS idx_promo_seo_active ON promo_seo(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_automation_slug ON promo_automation(slug);
CREATE INDEX IF NOT EXISTS idx_promo_automation_active ON promo_automation(is_active);

-- Add comments for documentation
COMMENT ON TABLE promo_seo IS 'SEO campaign promotional content and pricing';
COMMENT ON TABLE promo_automation IS 'AI Automation campaign promotional content and pricing';
COMMENT ON COLUMN promo_seo.features IS 'JSON array of feature objects with icon, title, description, and order';
COMMENT ON COLUMN promo_automation.features IS 'JSON array of feature objects with icon, title, description, and order';

-- Grant appropriate permissions (adjust based on your user roles)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON promo_seo TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON promo_automation TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE promo_seo_id_seq TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE promo_automation_id_seq TO your_app_user;

-- Verification queries (uncomment to test)
-- SELECT 'SEO Campaign Video' as table_name, COUNT(*) as records FROM campaign_videos WHERE page_slug = 'campaign-seo';
-- SELECT 'Automation Campaign Video' as table_name, COUNT(*) as records FROM campaign_videos WHERE page_slug = 'campaign-automation';
-- SELECT 'SEO Promo Data' as table_name, COUNT(*) as records FROM promo_seo;
-- SELECT 'Automation Promo Data' as table_name, COUNT(*) as records FROM promo_automation;

-- Success message
SELECT 'Campaign expansion database setup completed successfully!' as status; 