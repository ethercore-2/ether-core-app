export interface Blog {
  id: number;
  title: string;
  content: string;
  image_url: string;
  published_at: string;
  slug: string;
  tags: string[];
  // SEO Image fields
  image_alt?: string;
  image_title?: string;
  image_description?: string;
  image_caption?: string;
  image_width?: number;
  image_height?: number;
  image_file_size?: number;
  image_format?: string;
  image_seo_score?: number;
} 