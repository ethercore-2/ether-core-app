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