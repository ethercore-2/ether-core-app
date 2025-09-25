export interface AutomationGalleryItem {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  image_url: string;
  image_alt: string;
  image_title?: string;
  meta_description?: string;
  display_order: number;
  is_active: boolean;
  schema_data?: Record<string, unknown>;
}

export interface AutomationGalleryProps {
  ctaText?: string;
  ctaUrl?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  initialData?: AutomationGalleryItem[];
} 