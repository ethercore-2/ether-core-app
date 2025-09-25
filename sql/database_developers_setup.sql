-- =============================================
-- EtherCore - Developers Table Setup
-- =============================================
-- This script creates the developers table for team showcase
-- Run this in your Supabase SQL editor

-- Create developers table
CREATE TABLE IF NOT EXISTS developers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    bio TEXT,
    photo_url TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    linkedin_url TEXT,
    github_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_developers_active ON developers(is_active);
CREATE INDEX IF NOT EXISTS idx_developers_display_order ON developers(display_order);
CREATE INDEX IF NOT EXISTS idx_developers_created_at ON developers(created_at);

-- Insert sample developer data
INSERT INTO developers (name, role, bio, photo_url, skills, linkedin_url, github_url, display_order, is_active) VALUES
(
    'Alex Thompson',
    'Full-Stack Developer & Co-Founder',
    'Passionate full-stack developer with 8+ years of experience in modern web technologies. Specializes in React, Node.js, and cloud architecture. Led development of 50+ successful projects.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    '["React", "Next.js", "Node.js", "TypeScript", "AWS", "PostgreSQL", "Docker", "GraphQL"]',
    'https://linkedin.com/in/alexthompson',
    'https://github.com/alexthompson',
    1,
    true
),
(
    'Sarah Chen',
    'AI/ML Engineer & Technical Lead',
    'AI/ML specialist with expertise in automation, chatbots, and intelligent systems. PhD in Computer Science, 6+ years building scalable AI solutions for businesses worldwide.',
    'https://images.unsplash.com/photo-1494790108755-2616b9a8c0e2?w=400&h=400&fit=crop&crop=face',
    '["Python", "TensorFlow", "PyTorch", "OpenAI API", "Machine Learning", "NLP", "Computer Vision", "Azure AI"]',
    'https://linkedin.com/in/sarahchen',
    'https://github.com/sarahchen',
    2,
    true
);

-- Enable Row Level Security (RLS)
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to active developers" ON developers
    FOR SELECT USING (is_active = true);

-- Create policies for authenticated users (admin access)
CREATE POLICY "Allow authenticated users full access to developers" ON developers
    FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON developers TO anon;
GRANT ALL ON developers TO authenticated;
GRANT ALL ON developers TO service_role;

-- Add helpful comments
COMMENT ON TABLE developers IS 'Team members and developers information for About Us section';
COMMENT ON COLUMN developers.name IS 'Full name of the developer';
COMMENT ON COLUMN developers.role IS 'Job title or role in the company';
COMMENT ON COLUMN developers.bio IS 'Professional biography and experience';
COMMENT ON COLUMN developers.photo_url IS 'URL to profile photo/headshot';
COMMENT ON COLUMN developers.skills IS 'JSON array of technical skills and technologies';
COMMENT ON COLUMN developers.linkedin_url IS 'LinkedIn profile URL';
COMMENT ON COLUMN developers.github_url IS 'GitHub profile URL';
COMMENT ON COLUMN developers.display_order IS 'Order for displaying developers (ascending)';
COMMENT ON COLUMN developers.is_active IS 'Whether the developer should be displayed publicly';

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_developers_updated_at 
    BEFORE UPDATE ON developers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Developers table created successfully with sample data!' as status; 