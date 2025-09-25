-- ============================================
-- ETHERCORE DATABASE TABLES SETUP
-- ============================================

-- Company Information Table
CREATE TABLE company_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(100) NOT NULL DEFAULT 'EtherCore',
    tagline TEXT DEFAULT 'Your Trusted Partner for Affordable Digital Solutions',
    primary_email VARCHAR(100) NOT NULL DEFAULT 'admin@ether-core.com',
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'United Kingdom',
    website_url VARCHAR(255) DEFAULT 'https://ether-core.com',
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    github_url VARCHAR(255),
    calendly_url VARCHAR(255) DEFAULT 'https://calendly.com/admin-ether-core/15min',
    logo_url TEXT DEFAULT 'https://ejoimfdulvukutxdznem.supabase.co/storage/v1/object/public/logo_ether/logo_name2.png',
    business_hours TEXT DEFAULT 'Mon-Fri 9:00-18:00 GMT',
    founded_year INTEGER,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero Sections Table
CREATE TABLE hero_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_route VARCHAR(100) NOT NULL UNIQUE, -- e.g., '/', '/services', '/contact'
    headline TEXT NOT NULL,
    subheadline TEXT,
    description TEXT,
    primary_cta_text VARCHAR(100) DEFAULT 'Get Started',
    primary_cta_url VARCHAR(255) DEFAULT '/contact',
    secondary_cta_text VARCHAR(100),
    secondary_cta_url VARCHAR(255),
    background_image_url TEXT,
    background_video_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Metadata Table
CREATE TABLE seo_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_route VARCHAR(100) NOT NULL UNIQUE, -- e.g., '/', '/services', '/blog'
    meta_title VARCHAR(70) NOT NULL,
    meta_description VARCHAR(160) NOT NULL,
    meta_keywords TEXT,
    canonical_url VARCHAR(255),
    og_title VARCHAR(70),
    og_description VARCHAR(160),
    og_image_url TEXT,
    og_type VARCHAR(50) DEFAULT 'website',
    twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    twitter_title VARCHAR(70),
    twitter_description VARCHAR(160),
    twitter_image_url TEXT,
    structured_data JSONB, -- For Schema.org JSON-LD
    robots VARCHAR(100) DEFAULT 'index, follow',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal Pages Table
CREATE TABLE legal_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_type VARCHAR(50) NOT NULL UNIQUE, -- 'privacy', 'terms', 'cookies'
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
    version VARCHAR(20) DEFAULT '1.0',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Content Table (for reusable content blocks)
CREATE TABLE site_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_key VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'footer_copyright', 'nav_cta_button'
    content_type VARCHAR(50) NOT NULL, -- 'text', 'html', 'json'
    title VARCHAR(200),
    content TEXT NOT NULL,
    description TEXT, -- for admin reference
    category VARCHAR(100), -- 'navigation', 'footer', 'cta', 'pricing'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE PUBLIC READ POLICIES
-- ============================================

-- Company Info Policies
CREATE POLICY "Allow public read access" ON company_info 
FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to update" ON company_info 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Hero Sections Policies
CREATE POLICY "Allow public read access" ON hero_sections 
FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage" ON hero_sections 
FOR ALL USING (auth.role() = 'authenticated');

-- SEO Metadata Policies
CREATE POLICY "Allow public read access" ON seo_metadata 
FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage" ON seo_metadata 
FOR ALL USING (auth.role() = 'authenticated');

-- Legal Pages Policies
CREATE POLICY "Allow public read access" ON legal_pages 
FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage" ON legal_pages 
FOR ALL USING (auth.role() = 'authenticated');

-- Site Content Policies
CREATE POLICY "Allow public read access" ON site_content 
FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage" ON site_content 
FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- INSERT INITIAL DATA
-- ============================================

-- Company Information
INSERT INTO company_info (
    company_name, tagline, primary_email, phone, website_url, 
    calendly_url, logo_url, business_hours, description
) VALUES (
    'EtherCore',
    'Your Trusted Partner for Affordable Digital Solutions',
    'admin@ether-core.com',
    '+44 7700 900123',
    'https://ether-core.com',
    'https://calendly.com/admin-ether-core/15min',
    'https://ejoimfdulvukutxdznem.supabase.co/storage/v1/object/public/logo_ether/logo_name2.png',
    'Mon-Fri 9:00-18:00 GMT',
    'We specialize in web development, AI automation, and SEO optimization, delivering affordable digital solutions for businesses worldwide.'
);

-- Hero Sections
INSERT INTO hero_sections (page_route, headline, subheadline, description, primary_cta_text, secondary_cta_text, secondary_cta_url) VALUES
('/', 'WELCOME TO ETHERCORE', 'Your Trusted Partner for Affordable Digital Solutions', 'Transform your business with our cutting-edge web development, AI automation, and SEO services.', 'Get Started', 'Learn More', '/services'),
('/services', 'Our Digital Solutions', 'Transform Your Business', 'We combine innovation, expertise, and affordability to deliver exceptional results.', 'Schedule a Consultation', NULL, NULL),
('/projects', 'Our Latest Projects', 'Excellence in Digital Solutions', 'Explore our portfolio of successful projects. Each one represents our commitment to excellence and innovation.', 'Start Your Project', NULL, NULL),
('/contact', 'Let''s Build Something Amazing Together', 'Ready to Transform Your Business?', 'Get in touch with us today and take the first step towards transforming your online presence.', 'Schedule Your Free Call', 'Send Message', '#contact-form'),
('/blog', 'Latest Insights', 'Stay Updated', 'Read the latest articles and industry trends from the EtherCore team.', 'Read Articles', NULL, NULL);

-- SEO Metadata
INSERT INTO seo_metadata (page_route, meta_title, meta_description, meta_keywords, og_title, og_description, og_image_url) VALUES
('/', 'EtherCore - Affordable Digital Solutions | Web Development & AI', 'Transform your business with professional web development, AI automation, and SEO optimization services. Fixed £300 pricing with 3 months support included.', 'web development, AI automation, digital solutions, SEO optimization, affordable websites, Next.js, React', 'EtherCore - Affordable Digital Solutions', 'Professional web development and AI automation services starting at £300', 'https://ejoimfdulvukutxdznem.supabase.co/storage/v1/object/public/logo_ether/logo_name2.png'),
('/services', 'Our Services - Web Development & AI Automation | EtherCore', 'Discover our professional services: modern web development, AI automation, SEO optimization, and UX/UI design. Affordable solutions for your business.', 'web development services, AI automation, SEO optimization, UX UI design, technology solutions, digital services', 'Professional Digital Services | EtherCore', 'Modern web development, AI automation, and SEO services', 'https://ejoimfdulvukutxdznem.supabase.co/storage/v1/object/public/logo_ether/logo_name2.png'),
('/projects', 'Our Projects Portfolio - Web Development Cases | EtherCore', 'Explore our portfolio of successful web development and AI automation projects. See real examples of our work and client success stories.', 'web development portfolio, AI projects, client work, case studies, project examples', 'EtherCore Project Portfolio', 'Successful web development and AI automation projects', 'https://ejoimfdulvukutxdznem.supabase.co/storage/v1/object/public/logo_ether/logo_name2.png'),
('/contact', 'Contact Us - Free Consultation | EtherCore Digital Solutions', 'Get in touch for a free 15-minute consultation. Discuss your project needs and get a custom quote for web development and AI automation services.', 'contact, free consultation, web development quote, AI automation, project discussion', 'Contact EtherCore - Free Consultation', 'Book a free consultation to discuss your project needs', 'https://ejoimfdulvukutxdznem.supabase.co/storage/v1/object/public/logo_ether/logo_name2.png'),
('/blog', 'Blog - Tech Insights & Industry Updates | EtherCore', 'Read the latest articles about web development, AI automation, SEO optimization, and digital transformation trends from our expert team.', 'tech blog, web development articles, AI insights, SEO tips, digital transformation', 'EtherCore Tech Blog & Insights', 'Latest articles on web development, AI, and digital transformation', 'https://ejoimfdulvukutxdznem.supabase.co/storage/v1/object/public/logo_ether/logo_name2.png');

-- Site Content
INSERT INTO site_content (content_key, content_type, title, content, category) VALUES
('nav_cta_button', 'text', 'Navigation CTA Button', 'Free Consultation', 'navigation'),
('footer_copyright', 'text', 'Footer Copyright', 'Ether Core. All rights reserved.', 'footer'),
('footer_company_name', 'text', 'Footer Company Name', 'Ether Core', 'footer'),
('pricing_amount', 'text', 'Main Pricing Amount', '£300 Fixed Price', 'pricing'),
('pricing_description', 'text', 'Pricing Description', 'Everything you need to get your business online with professional support', 'pricing'),
('consultation_duration', 'text', 'Consultation Duration', '15 Minutes', 'contact'),
('consultation_title', 'text', 'Consultation Title', 'Free Consultation Call', 'contact'),
('support_email', 'text', 'Support Email Display', 'admin@ether-core.com', 'contact');

-- Legal Pages
INSERT INTO legal_pages (page_type, title, content, last_updated) VALUES
('privacy', 'Privacy Policy', 'This Privacy Policy explains how EtherCore collects, uses, and protects your personal information...', CURRENT_DATE),
('terms', 'Terms of Service', 'These Terms of Service govern your use of the EtherCore website and services...', CURRENT_DATE),
('cookies', 'Cookie Policy', 'This Cookie Policy explains how EtherCore uses cookies and similar technologies...', CURRENT_DATE);

-- ============================================
-- CREATE HELPFUL VIEWS
-- ============================================

-- View for complete page SEO data
CREATE VIEW page_seo_complete AS
SELECT 
    s.page_route,
    s.meta_title,
    s.meta_description,
    s.meta_keywords,
    s.canonical_url,
    s.og_title,
    s.og_description,
    s.og_image_url,
    s.structured_data,
    h.headline,
    h.subheadline,
    h.description as hero_description,
    h.primary_cta_text,
    h.primary_cta_url
FROM seo_metadata s
LEFT JOIN hero_sections h ON s.page_route = h.page_route
WHERE s.is_active = true AND (h.is_active = true OR h.is_active IS NULL);

-- View for active company info
CREATE VIEW company_info_active AS
SELECT * FROM company_info WHERE is_active = true LIMIT 1; 