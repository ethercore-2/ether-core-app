import { supabase } from './supabase';

export interface PromoSEM {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  setup_price_amount: number;
  monthly_price_amount: number;
  price_currency: string;
  setup_price_label: string;
  monthly_price_label: string;
  benefits: Array<{
    icon: string;
    order: number;
    title: string;
    description: string;
    metric: string;
  }>;
  cta_button_text: string;
  cta_button_url: string;
  additional_info?: string;
  is_active: boolean;
  display_order: number;
  background_gradient: string;
  price_tag_gradient: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
  // SEO fields
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
  schema_data?: Record<string, unknown>;
}

/**
 * Fetch active SEM promo data from database
 */
export async function getSemPromoData(): Promise<PromoSEM | null> {
  try {
    const { data, error } = await supabase
      .from('promo_sem')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching SEM promo data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getSemPromoData:', error);
    return null;
  }
}

/**
 * Get SEM promo data with revalidation for production
 */
export async function getSemPromoWithRevalidation(): Promise<PromoSEM | null> {
  try {
    const data = await getSemPromoData();
    
    // In production, you might want to add caching/revalidation logic here
    // For now, we'll return the data directly
    return data;
  } catch (error) {
    console.error('Error in getSemPromoWithRevalidation:', error);
    return null;
  }
}

/**
 * Generate schema markup for SEM promo
 */
export function generateSemPromoSchema(promo: PromoSEM): Record<string, unknown> {
  // Use existing schema_data if available, otherwise generate one
  if (promo.schema_data) {
    return promo.schema_data;
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": promo.title || "Google Ads Campaign Management",
    "description": promo.subtitle || "Professional PPC management to drive qualified leads and maximize ROI",
    "brand": {
      "@type": "Brand",
      "name": "EtherCore"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": promo.setup_price_label || "Initial Setup",
        "price": promo.setup_price_amount?.toString() || "0",
        "priceCurrency": promo.price_currency || "GBP",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": promo.monthly_price_label || "Monthly Management",
        "price": promo.monthly_price_amount?.toString() || "0",
        "priceCurrency": promo.price_currency || "GBP",
        "availability": "https://schema.org/InStock",
        "priceSpecification": {
          "@type": "RecurringCharge",
          "frequency": "Monthly"
        }
      }
    ],
    "category": "Google Ads Management Services",
    "provider": {
      "@type": "Organization",
      "name": "EtherCore",
      "url": "https://ether-core.com"
    }
  };
} 