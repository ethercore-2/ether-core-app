import { supabase } from './supabase';

export interface PromoWeb {
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
 * Fetch active web promo data from database
 */
export async function getWebPromoData(): Promise<PromoWeb | null> {
  try {
    const { data, error } = await supabase
      .from('promo_web')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching web promo data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getWebPromoData:', error);
    return null;
  }
}

/**
 * Get web promo data with revalidation for production
 */
export async function getWebPromoWithRevalidation(): Promise<PromoWeb | null> {
  try {
    const data = await getWebPromoData();
    
    // In production, you might want to add caching/revalidation logic here
    // For now, we'll return the data directly
    return data;
  } catch (error) {
    console.error('Error in getWebPromoWithRevalidation:', error);
    return null;
  }
}

/**
 * Generate schema markup for web promo
 */
export function generateWebPromoSchema(promo: PromoWeb): Record<string, unknown> {
  // Use existing schema_data if available, otherwise generate one
  if (promo.schema_data) {
    return promo.schema_data;
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": promo.title || "Web Development Service",
    "description": promo.subtitle || "Professional web development services",
    "price": promo.price_amount?.toString() || "0",
    "priceCurrency": promo.price_currency || "GBP",
    "availability": "https://schema.org/InStock",
    "validFrom": promo.created_at || new Date().toISOString(),
    "seller": {
      "@type": "Organization",
      "name": "EtherCore",
      "url": "https://ether-core.com"
    },
    "category": "Web Development Services",
    "itemOffered": {
      "@type": "Service",
      "name": promo.title || "Web Development Service",
      "description": promo.subtitle || "Professional web development services",
      "provider": {
        "@type": "Organization",
        "name": "EtherCore",
        "url": "https://ether-core.com"
      }
    }
  };
}

/**
 * Fetch e-commerce promo data specifically (row 2 from promo_web)
 */
export async function getEcommercePromoData(): Promise<PromoWeb | null> {
  try {
    // First try to get the specific e-commerce package
    const { data, error } = await supabase
      .from('promo_web')
      .select('*')
      .eq('slug', 'ecommerce-package-800')
      .limit(1);

    if (error) {
      console.error('Error fetching e-commerce promo data:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // If table doesn't exist, log it but return null gracefully
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        console.log('promo_web table does not exist yet - using fallback data');
        return null;
      }
      
      return null;
    }

    // Return the first result if found
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error in getEcommercePromoData:', error);
    return null;
  }
}

/**
 * Get e-commerce promo data with revalidation for production
 */
export async function getEcommercePromoWithRevalidation(): Promise<PromoWeb | null> {
  try {
    const data = await getEcommercePromoData();
    
    // If database fetch fails, return null gracefully so the component uses fallback data
    if (!data) {
      console.log('No e-commerce promo data found, component will use fallback data');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getEcommercePromoWithRevalidation:', error);
    return null;
  }
}

/**
 * Generate schema markup for e-commerce promo
 */
export function generateEcommercePromoSchema(promo: PromoWeb): Record<string, unknown> {
  // Use existing schema_data if available, otherwise generate one
  if (promo.schema_data) {
    return promo.schema_data;
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": promo.title || "E-Commerce Solution",
    "description": promo.subtitle || "Complete online store with payment integration",
    "price": promo.price_amount?.toString() || "800",
    "priceCurrency": promo.price_currency || "GBP",
    "availability": "https://schema.org/InStock",
    "validFrom": promo.created_at || new Date().toISOString(),
    "seller": {
      "@type": "Organization",
      "name": "EtherCore",
      "url": "https://ether-core.com"
    },
    "category": "E-Commerce Development Services",
    "itemOffered": {
      "@type": "Service",
      "name": promo.title || "E-Commerce Solution",
      "description": promo.subtitle || "Complete online store with payment integration",
      "provider": {
        "@type": "Organization",
        "name": "EtherCore",
        "url": "https://ether-core.com"
      }
    }
  };
} 