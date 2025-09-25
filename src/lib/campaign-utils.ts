import { supabase } from './supabase';

export interface CampaignVideo {
  id: number;
  page_slug: string;
  video_url: string;
  header_text: string;
  subtitle_text: string;
  cta_button_text: string;
  cta_button_url: string;
  cta_button_text_2?: string;
  cta_button_url_2?: string;
  cta_button_icon_2?: string;
  video_duration?: number;
  video_thumbnail_url?: string;
  autoplay: boolean;
  muted: boolean;
  loop_video: boolean;
  video_type: string;
  priority: number;
  meta_title?: string;
  meta_description?: string;
  video_schema?: Record<string, unknown>;
  video_keywords?: string;
  created_at: string;
  updated_at: string;
}

// Fetch campaign video data with revalidation
export async function getCampaignVideoWithRevalidation(pageSlug: string): Promise<CampaignVideo | null> {
  try {
    const { data, error } = await supabase
      .from('campaign_videos')
      .select('*')
      .eq('page_slug', pageSlug)
      .eq('is_active', true)
      .order('priority', { ascending: true })
      .single();

    if (error) {
      console.error('Error fetching campaign video:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch campaign video:', error);
    return null;
  }
}

// Generate VideoObject schema for campaign videos
export function generateVideoObjectSchema(campaignVideo: CampaignVideo, companyInfo?: Record<string, unknown>): Record<string, unknown> {
  // Extract video ID from URL for additional metadata
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(campaignVideo.video_url);
  const thumbnailUrl = campaignVideo.video_thumbnail_url || 
    (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null);

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": campaignVideo.meta_title || campaignVideo.header_text,
    "description": campaignVideo.meta_description || campaignVideo.subtitle_text,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": campaignVideo.created_at,
    "duration": campaignVideo.video_duration ? `PT${campaignVideo.video_duration}S` : undefined,
    "embedUrl": campaignVideo.video_url,
    "publisher": {
      "@type": "Organization",
      "name": companyInfo?.company_name || "EtherCore",
      "url": companyInfo?.website_url || "https://ether-core.com",
      "logo": {
        "@type": "ImageObject",
        "url": companyInfo?.logo_url || "https://www.ether-core.com/android-chrome-512x512.png"
      }
    },
    "keywords": campaignVideo.video_keywords,
    "genre": "Business",
    "inLanguage": "en-US"
  };
}

// Generate Service schema for campaign pages
export function generateCampaignServiceSchema(companyInfo?: Record<string, unknown>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Web Development & AI Automation Services",
    "description": "Professional web development, AI automation, and digital transformation services",
    "provider": {
      "@type": "Organization",
      "name": companyInfo?.company_name || "EtherCore",
      "url": companyInfo?.website_url || "https://ether-core.com",
      "telephone": companyInfo?.phone,
      "email": companyInfo?.primary_email
    },
    "serviceType": "Digital Services",
    "category": "Web Development",
    "offers": {
      "@type": "Offer",
      "description": "Free consultation and custom web development solutions",
      "price": "0",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString().split('T')[0],
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
    },
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digital Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Development",
            "description": "Custom website development using modern technologies"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Automation",
            "description": "Intelligent automation solutions for business processes"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "SEO Optimization",
            "description": "Search engine optimization for better online visibility"
          }
        }
      ]
    }
  };
}

// Generate LocalBusiness schema for campaign pages
export function generateCampaignLocalBusinessSchema(companyInfo?: Record<string, unknown>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": companyInfo?.website_url || "https://ether-core.com",
    "name": companyInfo?.company_name || "EtherCore",
    "description": companyInfo?.description || "Professional web development and AI automation services",
    "url": companyInfo?.website_url || "https://ether-core.com",
    "logo": companyInfo?.logo_url || "https://www.ether-core.com/android-chrome-512x512.png",
    "image": companyInfo?.logo_url || "https://www.ether-core.com/android-chrome-512x512.png",
    "telephone": companyInfo?.phone,
    "email": companyInfo?.primary_email,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB",
      "addressRegion": "England"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.5074",
      "longitude": "-0.1278"
    },
    "openingHours": companyInfo?.business_hours || "Mo-Fr 09:00-18:00",
    "priceRange": "£300-£5000",
    "serviceArea": {
      "@type": "Place",
      "name": "United Kingdom"
    },
    "sameAs": [
      companyInfo?.website_url || "https://ether-core.com"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digital Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Free Consultation",
            "description": "30-minute free consultation for digital transformation needs"
          },
          "price": "0",
          "priceCurrency": "GBP"
        }
      ]
    }
  };
}

// Generate comprehensive schema array for campaign pages
export function generateCampaignSchemas(
  campaignVideo: CampaignVideo | null,
  companyInfo?: Record<string, unknown>
): Record<string, unknown>[] {
  const schemas = [];

  // Always include LocalBusiness schema
  schemas.push(generateCampaignLocalBusinessSchema(companyInfo));

  // Add Service schema
  schemas.push(generateCampaignServiceSchema(companyInfo));

  // Add VideoObject schema if video exists
  if (campaignVideo) {
    if (campaignVideo.video_schema) {
      // Use custom schema from database if available
      schemas.push(campaignVideo.video_schema);
    } else {
      // Generate default video schema
      schemas.push(generateVideoObjectSchema(campaignVideo, companyInfo));
    }
  }

  return schemas;
}

// Utility function to extract YouTube video ID
export function extractYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/);
  return match ? match[1] : null;
}

// Generate video thumbnail URL
export function generateVideoThumbnailUrl(videoUrl: string, customThumbnail?: string): string | null {
  if (customThumbnail) return customThumbnail;
  
  const videoId = extractYouTubeVideoId(videoUrl);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
}

// Map service categories to campaign pages
export function getServiceCampaignUrl(service: { service_category?: string; slug?: string }): string {
  const categoryMappings: Record<string, string> = {
    'SEO Services': '/campaign-seo',
    'Web Development': '/campaign-web', 
    'AI Automation': '/campaign-automation',
    'Design Services': '/campaign-web' // UX/UI can go to web campaign
  };

  // Try exact category match first
  if (service.service_category && categoryMappings[service.service_category]) {
    return categoryMappings[service.service_category];
  }

  // Fallback: try to match by service name/slug
  if (service.slug) {
    if (service.slug.includes('seo')) return '/campaign-seo';
    if (service.slug.includes('web') || service.slug.includes('design')) return '/campaign-web';
    if (service.slug.includes('ai') || service.slug.includes('automation')) return '/campaign-automation';
  }

  // Default fallback
  return '/contact';
}

// Generate CTA text based on service
export function getServiceCtaText(service: { service_category?: string; name?: string }): string {
  const ctaMappings: Record<string, string> = {
    'SEO Services': 'Boost Your Rankings',
    'Web Development': 'Build Your Website', 
    'AI Automation': 'Automate Your Business',
    'Design Services': 'Design Your Brand'
  };

  return service.service_category && ctaMappings[service.service_category] 
    ? ctaMappings[service.service_category]
    : 'Learn More';
} 