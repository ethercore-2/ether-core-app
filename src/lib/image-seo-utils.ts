import { supabase } from './supabase';
import type { Blog } from '@/types/blog';

// Image SEO scoring function
export function calculateImageSeoScore(blog: Blog): number {
  let score = 0;
  
  // Base score for having an image
  if (blog.image_url) score += 25;
  
  // Alt text quality (most important)
  if (blog.image_alt) {
    if (blog.image_alt.length > 10 && blog.image_alt.length < 125) {
      score += 30; // Good alt text length
    } else if (blog.image_alt.length > 0) {
      score += 15; // Has alt text but could be better
    }
  }
  
  // Title attribute
  if (blog.image_title && blog.image_title.length > 0) score += 15;
  
  // Description
  if (blog.image_description && blog.image_description.length > 0) score += 15;
  
  // Caption (optional but nice)
  if (blog.image_caption && blog.image_caption.length > 0) score += 10;
  
  // Dimensions (good for performance)
  if (blog.image_width && blog.image_height) score += 5;
  
  return Math.min(score, 100); // Cap at 100
}

// Generate alt text from blog content
export function generateAltText(blog: Blog): string {
  if (blog.image_alt) return blog.image_alt;
  
  // Extract first sentence or meaningful content
  const firstSentence = blog.content.split('.')[0];
  const cleanContent = firstSentence.replace(/[#*\n]/g, '').trim();
  
  return `${blog.title} - ${cleanContent.substring(0, 100)}`;
}

// Generate image title
export function generateImageTitle(blog: Blog): string {
  if (blog.image_title) return blog.image_title;
  return blog.title;
}

// Generate image description
export function generateImageDescription(blog: Blog): string {
  if (blog.image_description) return blog.image_description;
  return `Featured image for: ${blog.title}`;
}

// Auto-optimize blog images
export async function optimizeBlogImages() {
  try {
    // Fetch blogs with images that need optimization
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .not('image_url', 'is', null)
      .or('image_alt.is.null,image_seo_score.lt.80');

    if (error) throw error;

    const updates = blogs?.map((blog: Blog) => ({
      id: blog.id,
      image_alt: generateAltText(blog),
      image_title: generateImageTitle(blog),
      image_description: generateImageDescription(blog),
      image_seo_score: calculateImageSeoScore({
        ...blog,
        image_alt: generateAltText(blog),
        image_title: generateImageTitle(blog),
        image_description: generateImageDescription(blog)
      })
    }));

    // Batch update
    if (updates && updates.length > 0) {
      for (const update of updates) {
        await supabase
          .from('blogs')
          .update({
            image_alt: update.image_alt,
            image_title: update.image_title,
            image_description: update.image_description,
            image_seo_score: update.image_seo_score
          })
          .eq('id', update.id);
      }
    }

    return { success: true, updated: updates?.length || 0 };
  } catch (error) {
    console.error('Failed to optimize blog images:', error);
    return { success: false, error };
  }
}

// Image dimensions - standard web dimensions
export function extractImageDimensions(): { width?: number; height?: number } {
  // For blogs, we'll default to standard web dimensions
  // In a real implementation, you could analyze the actual image
  return {
    width: 1200,  // Standard blog hero image width
    height: 675   // 16:9 aspect ratio
  };
}

// Get image format from URL
export function getImageFormat(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'jpg';
    case 'png':
      return 'png';
    case 'webp':
      return 'webp';
    default:
      return 'jpg';
  }
}

// Generate structured data for images
export function generateImageStructuredData(blog: Blog) {
  if (!blog.image_url) return null;
  
  return {
    "@type": "ImageObject",
    "url": blog.image_url,
    "width": blog.image_width || 1200,
    "height": blog.image_height || 675,
    "alt": blog.image_alt || blog.title,
    "description": blog.image_description || `Featured image for: ${blog.title}`,
    "caption": blog.image_caption || undefined
  };
}

// Check if image needs SEO optimization
export function needsImageOptimization(blog: Blog): boolean {
  if (!blog.image_url) return false;
  
  return (
    !blog.image_alt ||
    !blog.image_title ||
    (blog.image_seo_score || 0) < 80
  );
}

// Get image SEO recommendations
export function getImageSeoRecommendations(blog: Blog): string[] {
  const recommendations: string[] = [];
  
  if (!blog.image_url) {
    recommendations.push('Add a featured image');
    return recommendations;
  }
  
  if (!blog.image_alt || blog.image_alt.length < 10) {
    recommendations.push('Add descriptive alt text (10-125 characters)');
  }
  
  if (!blog.image_title) {
    recommendations.push('Add image title attribute');
  }
  
  if (!blog.image_description) {
    recommendations.push('Add image description for better context');
  }
  
  if (!blog.image_width || !blog.image_height) {
    recommendations.push('Add image dimensions for better performance');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Image SEO is fully optimized! 🎉');
  }
  
  return recommendations;
} 