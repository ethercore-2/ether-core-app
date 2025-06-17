import { supabase } from './supabase';
import { HeroSection } from '@/types/hero';

// Fetch hero section for a specific page route
export async function getHeroSection(pageRoute: string): Promise<HeroSection | null> {
  const { data: hero } = await supabase
    .from('hero_sections')
    .select('*')
    .eq('page_route', pageRoute)
    .eq('is_active', true)
    .single();

  return hero as HeroSection | null;
}

// Fetch hero section with cache revalidation
export async function getHeroSectionWithRevalidation(pageRoute: string): Promise<HeroSection | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/hero_sections?page_route=eq.${pageRoute}&is_active=eq.true&select=*`, {
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
    },
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  if (!res.ok) return null;
  
  const data = await res.json();
  return data[0] as HeroSection | null;
}

// Fetch all active hero sections (for sitemap, etc.)
export async function getAllHeroSections(): Promise<HeroSection[]> {
  const { data: heroes } = await supabase
    .from('hero_sections')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  return (heroes || []) as HeroSection[];
} 