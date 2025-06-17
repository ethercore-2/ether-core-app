import { supabase } from './supabase';
import { CompanyInfo } from '@/types/hero';

// Fetch active company information
export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  const { data: company } = await supabase
    .from('company_info')
    .select('*')
    .eq('is_active', true)
    .single();

  return company as CompanyInfo | null;
}

// Fetch active company information with cache revalidation
export async function getCompanyInfoWithRevalidation(): Promise<CompanyInfo | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/company_info?is_active=eq.true&select=*`, {
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
    },
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  if (!res.ok) return null;
  
  const data = await res.json();
  return data[0] as CompanyInfo | null;
}

// Fetch site content by key
export async function getSiteContent(contentKey: string): Promise<string | null> {
  const { data: content } = await supabase
    .from('site_content')
    .select('content')
    .eq('content_key', contentKey)
    .eq('is_active', true)
    .single();

  return content?.content || null;
}

// Fetch multiple site content keys at once
export async function getSiteContentBatch(contentKeys: string[]): Promise<Record<string, string>> {
  const { data: contents } = await supabase
    .from('site_content')
    .select('content_key, content')
    .in('content_key', contentKeys)
    .eq('is_active', true);

  const result: Record<string, string> = {};
  contents?.forEach((item) => {
    result[item.content_key] = item.content;
  });

  return result;
} 