-- =====================================================
-- PROMO WEB TABLE SETUP
-- Table for managing website promotion sections (£300 promo)
-- =====================================================

-- Drop table if exists (for development)
DROP TABLE IF EXISTS public.promo_web CASCADE;

-- Create promo_web table
CREATE TABLE public.promo_web (
    id BIGSERIAL PRIMARY KEY,
    
    -- Basic Information
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    price_amount DECIMAL(10,2) NOT NULL,
    price_currency VARCHAR(10) DEFAULT 'GBP',
    price_label VARCHAR(100) DEFAULT 'Fixed Price',
    
    -- CTA Information
    cta_button_text VARCHAR(100) NOT NULL,
    cta_button_url TEXT NOT NULL,
    additional_info TEXT,
    
    -- Feature Cards (JSON array for flexibility)
    features JSONB NOT NULL DEFAULT '[]',
    
    -- Display Settings
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    
    -- Background and Styling
    background_gradient VARCHAR(255) DEFAULT 'from-teal-500/10 to-blue-500/10',
    price_tag_gradient VARCHAR(255) DEFAULT 'from-teal-300 to-blue-400',
    
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

-- Create indexes for better performance
CREATE INDEX idx_promo_web_slug ON public.promo_web(slug);
CREATE INDEX idx_promo_web_active ON public.promo_web(is_active);
CREATE INDEX idx_promo_web_display_order ON public.promo_web(display_order);

-- Enable Row Level Security
ALTER TABLE public.promo_web ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Public can view active promo_web" ON public.promo_web
    FOR SELECT USING (is_active = true);

-- Policy for authenticated users to manage content
CREATE POLICY "Authenticated users can manage promo_web" ON public.promo_web
    FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_promo_web_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_promo_web_updated_at
    BEFORE UPDATE ON public.promo_web
    FOR EACH ROW
    EXECUTE FUNCTION update_promo_web_updated_at();

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert the £300 website promo data
INSERT INTO public.promo_web (
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
    'website-package-300',
    'Complete Website Package',
    'Everything you need to establish a strong online presence',
    300.00,
    'GBP',
    'Fixed Price',
    'Start Your Project',
    '/contact#consultation',
    '* Includes 3 months of free support and maintenance. Then £25 per month for ongoing support and maintenance.',
    '[
        {
            "icon": "🎨",
            "title": "Custom Design",
            "description": "Unique, modern design",
            "order": 1
        },
        {
            "icon": "📱",
            "title": "Responsive",
            "description": "Works on all devices",
            "order": 2
        },
        {
            "icon": "⚡",
            "title": "Fast Loading",
            "description": "Optimized performance",
            "order": 3
        },
        {
            "icon": "🔍",
            "title": "SEO Ready",
            "description": "Search engine optimized",
            "order": 4
        },
        {
            "icon": "🔒",
            "title": "Secure",
            "description": "SSL certificate included",
            "order": 5
        },
        {
            "icon": "📝",
            "title": "Easy Updates",
            "description": "User-friendly CMS",
            "order": 6
        }
    ]'::jsonb,
    'Complete Website Package - £300 Fixed Price | EtherCore',
    'Professional website development package for £300. Includes custom design, responsive layout, SEO optimization, and 3 months free support.',
    '{
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Complete Website Package",
        "description": "Professional website development package including custom design, responsive layout, and SEO optimization",
        "brand": {
            "@type": "Brand",
            "name": "EtherCore"
        },
        "offers": {
            "@type": "Offer",
            "price": "300",
            "priceCurrency": "GBP",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2025-12-31"
        },
        "category": "Web Development Services"
    }'::jsonb,
    'system'
);

-- Insert additional promo variants (optional)
INSERT INTO public.promo_web (
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
    is_active,
    display_order,
    created_by
) VALUES (
    'ecommerce-package-800',
    'E-Commerce Solution',
    'Complete online store with payment integration',
    800.00,
    'GBP',
    'Starting From',
    'Get Quote',
    '/contact#consultation',
    '* Includes product catalog, payment gateway, and inventory management.',
    '[
        {
            "icon": "🛒",
            "title": "Shopping Cart",
            "description": "Full e-commerce functionality",
            "order": 1
        },
        {
            "icon": "💳",
            "title": "Payment Gateway",
            "description": "Secure payment processing",
            "order": 2
        },
        {
            "icon": "📊",
            "title": "Analytics",
            "description": "Sales and visitor tracking",
            "order": 3
        },
        {
            "icon": "📦",
            "title": "Inventory",
            "description": "Product management system",
            "order": 4
        },
        {
            "icon": "🚚",
            "title": "Shipping",
            "description": "Delivery integration",
            "order": 5
        },
        {
            "icon": "📱",
            "title": "Mobile Ready",
            "description": "Optimized for mobile shopping",
            "order": 6
        }
    ]'::jsonb,
    false,
    2,
    'system'
);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get active promo by slug
CREATE OR REPLACE FUNCTION get_promo_web_by_slug(promo_slug VARCHAR)
RETURNS TABLE (
    id BIGINT,
    slug VARCHAR,
    title VARCHAR,
    subtitle TEXT,
    price_amount DECIMAL,
    price_currency VARCHAR,
    price_label VARCHAR,
    cta_button_text VARCHAR,
    cta_button_url TEXT,
    additional_info TEXT,
    features JSONB,
    background_gradient VARCHAR,
    price_tag_gradient VARCHAR,
    meta_title VARCHAR,
    meta_description TEXT,
    schema_data JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.slug,
        p.title,
        p.subtitle,
        p.price_amount,
        p.price_currency,
        p.price_label,
        p.cta_button_text,
        p.cta_button_url,
        p.additional_info,
        p.features,
        p.background_gradient,
        p.price_tag_gradient,
        p.meta_title,
        p.meta_description,
        p.schema_data
    FROM public.promo_web p
    WHERE p.slug = promo_slug 
    AND p.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all active promos ordered by display_order
CREATE OR REPLACE FUNCTION get_active_promo_web()
RETURNS TABLE (
    id BIGINT,
    slug VARCHAR,
    title VARCHAR,
    subtitle TEXT,
    price_amount DECIMAL,
    price_currency VARCHAR,
    price_label VARCHAR,
    cta_button_text VARCHAR,
    cta_button_url TEXT,
    additional_info TEXT,
    features JSONB,
    background_gradient VARCHAR,
    price_tag_gradient VARCHAR,
    meta_title VARCHAR,
    meta_description TEXT,
    schema_data JSONB,
    display_order INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.slug,
        p.title,
        p.subtitle,
        p.price_amount,
        p.price_currency,
        p.price_label,
        p.cta_button_text,
        p.cta_button_url,
        p.additional_info,
        p.features,
        p.background_gradient,
        p.price_tag_gradient,
        p.meta_title,
        p.meta_description,
        p.schema_data,
        p.display_order
    FROM public.promo_web p
    WHERE p.is_active = true
    ORDER BY p.display_order ASC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify the data was inserted correctly
SELECT 
    slug,
    title,
    price_amount,
    price_currency,
    jsonb_array_length(features) as feature_count,
    is_active
FROM public.promo_web
ORDER BY display_order;

-- Test the helper function
SELECT * FROM get_promo_web_by_slug('website-package-300');

-- Show feature details
SELECT 
    slug,
    title,
    jsonb_pretty(features) as features_formatted
FROM public.promo_web 
WHERE slug = 'website-package-300';

COMMENT ON TABLE public.promo_web IS 'Table for managing website promotion sections with dynamic content';
COMMENT ON COLUMN public.promo_web.features IS 'JSON array containing feature cards with icon, title, description, and order';
COMMENT ON COLUMN public.promo_web.schema_data IS 'Schema.org structured data for SEO';
COMMENT ON FUNCTION get_promo_web_by_slug(VARCHAR) IS 'Retrieves active promo web content by slug'; 