import { supabase } from './supabase';
import { SeoMetadata } from '@/types/hero';
import { Metadata } from 'next';

// Fetch SEO metadata for a specific page
export async function getSeoMetadata(pageRoute: string): Promise<SeoMetadata | null> {
  const { data: seo } = await supabase
    .from('seo_metadata')
    .select('*')
    .eq('page_route', pageRoute)
    .eq('is_active', true)
    .single();

  return seo as SeoMetadata | null;
}

// Fetch SEO metadata with cache revalidation
export async function getSeoMetadataWithRevalidation(pageRoute: string): Promise<SeoMetadata | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/seo_metadata?page_route=eq.${pageRoute}&is_active=eq.true&select=*`, {
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
    },
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  if (!res.ok) return null;
  
  const data = await res.json();
  return data[0] as SeoMetadata | null;
}

// Generate Next.js metadata object from database SEO data
export function generateMetadata(seoData?: SeoMetadata | null, fallback?: Partial<Metadata>): Metadata {
  if (!seoData) {
    return fallback || {};
  }

  const metadata: Metadata = {
    title: seoData.meta_title,
    description: seoData.meta_description,
    keywords: seoData.meta_keywords,
    robots: seoData.robots || 'index, follow',
    openGraph: {
      title: seoData.og_title || seoData.meta_title,
      description: seoData.og_description || seoData.meta_description,
      type: (seoData.og_type as 'website' | 'article') || 'website',
      images: seoData.og_image_url ? [seoData.og_image_url] : undefined,
    },
    twitter: {
      card: (seoData.twitter_card as 'summary' | 'summary_large_image') || 'summary_large_image',
      title: seoData.twitter_title || seoData.og_title || seoData.meta_title,
      description: seoData.twitter_description || seoData.og_description || seoData.meta_description,
      images: seoData.twitter_image_url ? [seoData.twitter_image_url] : seoData.og_image_url ? [seoData.og_image_url] : undefined,
    },
  };

  // Add canonical URL if provided
  if (seoData.canonical_url) {
    metadata.alternates = {
      canonical: seoData.canonical_url
    };
  }

  // Add robots meta tag
  if (seoData.robots) {
    metadata.robots = seoData.robots;
  }

  return metadata;
}

// Generate page-specific metadata with dynamic content
export async function generatePageMetadata(
  pageRoute: string, 
  dynamicContent?: {
    title?: string;
    description?: string;
    image?: string;
  }
): Promise<Metadata> {
  const seoData = await getSeoMetadata(pageRoute);
  
  if (dynamicContent && seoData) {
    // Override with dynamic content if provided
    const enhancedSeo: SeoMetadata = {
      ...seoData,
      meta_title: dynamicContent.title || seoData.meta_title,
      meta_description: dynamicContent.description || seoData.meta_description,
      og_title: dynamicContent.title || seoData.og_title || seoData.meta_title,
      og_description: dynamicContent.description || seoData.og_description || seoData.meta_description,
      og_image_url: dynamicContent.image || seoData.og_image_url,
      twitter_title: dynamicContent.title || seoData.twitter_title,
      twitter_description: dynamicContent.description || seoData.twitter_description,
      twitter_image_url: dynamicContent.image || seoData.twitter_image_url
    };
    
    return generateMetadata(enhancedSeo);
  }
  
  return generateMetadata(seoData);
} 