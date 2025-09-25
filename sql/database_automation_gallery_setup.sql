-- =============================================
-- Automation Gallery Table Setup
-- =============================================

-- Create automation_gallery table
CREATE TABLE IF NOT EXISTS public.automation_gallery (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Content Fields
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    
    -- SEO Fields
    image_alt TEXT NOT NULL,
    image_title TEXT,
    meta_description TEXT,
    
    -- Display & Ordering
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Optional Schema Data
    schema_data JSONB,
    
    -- Constraints
    CONSTRAINT automation_gallery_title_length CHECK (char_length(title) >= 10),
    CONSTRAINT automation_gallery_description_length CHECK (char_length(description) >= 50),
    CONSTRAINT automation_gallery_image_alt_length CHECK (char_length(image_alt) >= 10)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS automation_gallery_active_order_idx ON public.automation_gallery (is_active, display_order);
CREATE INDEX IF NOT EXISTS automation_gallery_created_at_idx ON public.automation_gallery (created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_automation_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER automation_gallery_updated_at_trigger
    BEFORE UPDATE ON public.automation_gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_automation_gallery_updated_at();

-- Insert sample data
INSERT INTO public.automation_gallery (
    title, 
    description, 
    image_url, 
    image_alt, 
    image_title, 
    meta_description, 
    display_order, 
    schema_data
) VALUES 
(
    'Blog Content Automation',
    'Automatically generate, optimize, and publish blog content with AI-powered writing assistants. Schedule posts, optimize for SEO, and maintain consistent publishing schedules without manual intervention.',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&crop=center',
    'AI blog automation dashboard showing content generation and publishing workflow',
    'Blog Content Automation - AI-Powered Content Creation',
    'Streamline your content marketing with automated blog creation, SEO optimization, and publishing workflows.',
    1,
    '{"@type": "Service", "name": "Blog Content Automation", "serviceType": "Content Marketing Automation"}'::jsonb
),
(
    'Lead Generation Automation',
    'Capture, qualify, and nurture leads automatically with intelligent chatbots, email sequences, and CRM integration. Convert website visitors into qualified prospects 24/7 without manual effort.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
    'Lead generation automation system with chatbot interface and CRM integration dashboard',
    'Lead Generation Automation - AI-Powered Lead Capture',
    'Maximize lead conversion with automated lead capture, qualification, and nurturing systems.',
    2,
    '{"@type": "Service", "name": "Lead Generation Automation", "serviceType": "Sales Automation"}'::jsonb
),
(
    'Email Marketing Automation',
    'Create personalized email campaigns that trigger based on user behavior, segment audiences automatically, and optimize send times for maximum engagement and conversion rates.',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=center',
    'Email marketing automation platform showing campaign workflows and analytics dashboard',
    'Email Marketing Automation - Personalized Campaign Management',
    'Boost email marketing ROI with automated personalization, segmentation, and behavioral triggers.',
    3,
    '{"@type": "Service", "name": "Email Marketing Automation", "serviceType": "Marketing Automation"}'::jsonb
);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on the table
ALTER TABLE public.automation_gallery ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (anyone can view active gallery items)
CREATE POLICY "Public read access for active automation gallery items"
    ON public.automation_gallery
    FOR SELECT
    USING (is_active = true);

-- Policy for authenticated users to read all items
CREATE POLICY "Authenticated users can read all automation gallery items"
    ON public.automation_gallery
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert automation gallery items"
    ON public.automation_gallery
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy for authenticated users to update
CREATE POLICY "Authenticated users can update automation gallery items"
    ON public.automation_gallery
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete automation gallery items"
    ON public.automation_gallery
    FOR DELETE
    TO authenticated
    USING (true);

-- =============================================
-- Grants
-- =============================================

-- Grant permissions to anon users for reading
GRANT SELECT ON public.automation_gallery TO anon;

-- Grant all permissions to authenticated users
GRANT ALL ON public.automation_gallery TO authenticated;

-- Grant usage on sequence
GRANT USAGE ON SEQUENCE public.automation_gallery_id_seq TO anon;
GRANT USAGE ON SEQUENCE public.automation_gallery_id_seq TO authenticated;

-- =============================================
-- Comments
-- =============================================

COMMENT ON TABLE public.automation_gallery IS 'Gallery showcasing different automation services with images and descriptions';
COMMENT ON COLUMN public.automation_gallery.title IS 'Title of the automation service (10-100 characters)';
COMMENT ON COLUMN public.automation_gallery.description IS 'Detailed description of the automation service (minimum 50 characters)';
COMMENT ON COLUMN public.automation_gallery.image_url IS 'URL of the service image';
COMMENT ON COLUMN public.automation_gallery.image_alt IS 'Alt text for the image (SEO and accessibility)';
COMMENT ON COLUMN public.automation_gallery.image_title IS 'Title attribute for the image (SEO)';
COMMENT ON COLUMN public.automation_gallery.meta_description IS 'Meta description for SEO purposes';
COMMENT ON COLUMN public.automation_gallery.display_order IS 'Order in which items should be displayed (lower numbers first)';
COMMENT ON COLUMN public.automation_gallery.is_active IS 'Whether the gallery item is active and should be displayed';
COMMENT ON COLUMN public.automation_gallery.schema_data IS 'JSON-LD schema data for rich snippets'; 