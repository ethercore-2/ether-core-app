import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });
      },
    },
  }
);

// Type definitions based on your database schema
export interface Testimonial {
  id: number;
  client_name: string;
  testimonial: string;
  rating: number;
  created_at: string;
}

export interface Portfolio {
  id: number;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  created_at: string;
  // Enhanced fields from database
  github_url?: string;
  client_name?: string;
  technologies?: string;
  category?: string;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  is_featured?: boolean;
  // Image SEO fields
  image_alt?: string;
  image_title?: string;
  image_description?: string;
  image_caption?: string;
  image_width?: number;
  image_height?: number;
  image_file_size?: number;
  image_format?: string;
  image_seo_score?: number;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  slug: string;
  image_url: string;
  published_at: string;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  icon_url: string;
  created_at: string;
  // Features (from screenshot)
  features1?: string;
  features2?: string;
  features3?: string;
  // SEO fields (from screenshot)
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  service_category?: string;
  price_range?: string;
  is_featured?: boolean;
  structured_data?: Record<string, unknown>;
  // CTA fields (new database columns)
  cta_text?: string;
  cta_url?: string;
  // Campaign integration
  campaign_url?: string; // Link to campaign pages like /campaign-seo, /campaign-web, etc.
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
} 