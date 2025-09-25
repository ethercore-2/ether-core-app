export interface HeroSection {
  id: string;
  page_route: string; // '/', '/services', '/contact', etc.
  headline: string;
  subheadline?: string;
  description?: string;
  primary_cta_text: string;
  primary_cta_url: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
  background_image_url?: string;
  background_video_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SeoMetadata {
  id: string;
  page_route: string;
  meta_title: string;
  meta_description: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  og_type: string;
  twitter_card: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image_url?: string;
  structured_data?: Record<string, unknown>; // JSONB
  robots: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyInfo {
  id: string;
  company_name: string;
  tagline: string;
  primary_email: string;
  phone?: string;
  website_url: string;
  calendly_url: string;
  logo_url: string;
  logo_figure?: string;
  business_hours: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
} 