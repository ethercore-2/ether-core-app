import { supabase } from './supabase';

export interface PromoAutomation {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  price_amount: number;
  price_currency: string;
  price_label: string;
  features: Array<{
    icon: string;
    order: number;
    title: string;
    description: string;
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
 * Fetch active Automation promo data from database
 */
export async function getAutomationPromoData(): Promise<PromoAutomation | null> {
  try {
    const { data, error } = await supabase
      .from('promo_automation')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching Automation promo data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getAutomationPromoData:', error);
    return null;
  }
}

/**
 * Get Automation promo data with revalidation for production
 */
export async function getAutomationPromoWithRevalidation(): Promise<PromoAutomation | null> {
  try {
    const data = await getAutomationPromoData();
    
    // In production, you might want to add caching/revalidation logic here
    // For now, we'll return the data directly
    return data;
  } catch (error) {
    console.error('Error in getAutomationPromoWithRevalidation:', error);
    return null;
  }
}

/**
 * Generate schema markup for Automation promo
 */
export function generateAutomationPromoSchema(promo: PromoAutomation): Record<string, unknown> {
  // Use existing schema_data if available, otherwise generate one
  if (promo.schema_data) {
    return promo.schema_data;
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": promo.title || "AI Business Automation Service",
    "description": promo.subtitle || "Custom AI automation solutions to streamline business operations",
    "price": promo.price_amount?.toString() || "0",
    "priceCurrency": promo.price_currency || "GBP",
    "availability": "https://schema.org/InStock",
    "validFrom": promo.created_at || new Date().toISOString(),
    "seller": {
      "@type": "Organization",
      "name": "EtherCore",
      "url": "https://ether-core.com"
    },
    "category": "AI Automation Services",
    "itemOffered": {
      "@type": "Service",
      "name": promo.title || "AI Business Automation Service",
      "description": promo.subtitle || "Custom AI automation solutions to streamline business operations",
      "provider": {
        "@type": "Organization",
        "name": "EtherCore",
        "url": "https://ether-core.com"
      }
    }
  };
} 