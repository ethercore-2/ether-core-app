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

// Fetch all active hero sections (for sitemap, etc.)
export async function getAllHeroSections(): Promise<HeroSection[]> {
  const { data: heroes } = await supabase
    .from('hero_sections')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  return (heroes || []) as HeroSection[];
} 