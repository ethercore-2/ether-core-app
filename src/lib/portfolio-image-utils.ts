import { supabase } from './supabase';
import type { Portfolio } from './supabase';

// Portfolio Image SEO scoring function
export function calculatePortfolioImageSeoScore(project: Portfolio): number {
  let score = 0;
  
  // Base score for having an image
  if (project.image_url) score += 20;
  
  // Alt text quality (most important for accessibility)
  if (project.image_alt) {
    if (project.image_alt.length > 10 && project.image_alt.length < 125) {
      score += 25; // Good alt text length
    } else if (project.image_alt.length > 0) {
      score += 10; // Has alt text but could be better
    }
  }
  
  // Title attribute
  if (project.image_title && project.image_title.length > 0) score += 15;
  
  // Description for context
  if (project.image_description && project.image_description.length > 0) score += 15;
  
  // Client context (portfolio-specific bonus)
  if (project.client_name && project.client_name.length > 0) score += 10;
  
  // Category for better organization
  if (project.category && project.category.length > 0) score += 10;
  
  // Technology stack information
  if (project.technologies && project.technologies.length > 0) score += 5;
  
  return Math.min(score, 100); // Cap at 100
}

// Generate alt text for portfolio projects
export function generatePortfolioAltText(project: Portfolio): string {
  if (project.image_alt) return project.image_alt;
  
  const clientPart = project.client_name ? ` for ${project.client_name}` : '';
  const categoryPart = project.category ? ` - ${project.category}` : '';
  
  return `${project.title}${clientPart}${categoryPart} - EtherCore Portfolio`;
}

// Generate image title for portfolio projects
export function generatePortfolioImageTitle(project: Portfolio): string {
  if (project.image_title) return project.image_title;
  
  const clientPart = project.client_name ? ` - ${project.client_name}` : '';
  return `${project.title}${clientPart}`;
}

// Generate image description for portfolio projects
export function generatePortfolioImageDescription(project: Portfolio): string {
  if (project.image_description) return project.image_description;
  
  const clientPart = project.client_name ? ` - Built for ${project.client_name}` : ' - EtherCore Portfolio';
  return `Project showcase for ${project.title}${clientPart}`;
}

// Generate image caption for portfolio projects
export function generatePortfolioImageCaption(project: Portfolio): string | undefined {
  if (project.image_caption) return project.image_caption;
  
  if (project.client_name) {
    return `${project.title} - Client: ${project.client_name}`;
  }
  
  return undefined; // No caption if no client specified
}

// Auto-optimize portfolio images
export async function optimizePortfolioImages() {
  try {
    // Fetch portfolio projects with images that need optimization
    const { data: projects, error } = await supabase
      .from('portfolio')
      .select('*')
      .not('image_url', 'is', null)
      .or('image_alt.is.null,image_seo_score.lt.80');

    if (error) throw error;

    const updates = projects?.map((project: Portfolio) => ({
      id: project.id,
      image_alt: generatePortfolioAltText(project),
      image_title: generatePortfolioImageTitle(project),
      image_description: generatePortfolioImageDescription(project),
      image_caption: generatePortfolioImageCaption(project),
      image_seo_score: calculatePortfolioImageSeoScore({
        ...project,
        image_alt: generatePortfolioAltText(project),
        image_title: generatePortfolioImageTitle(project),
        image_description: generatePortfolioImageDescription(project),
        image_caption: generatePortfolioImageCaption(project)
      })
    }));

    // Batch update
    if (updates && updates.length > 0) {
      for (const update of updates) {
        await supabase
          .from('portfolio')
          .update({
            image_alt: update.image_alt,
            image_title: update.image_title,
            image_description: update.image_description,
            image_caption: update.image_caption,
            image_seo_score: update.image_seo_score
          })
          .eq('id', update.id);
      }
    }

    return { success: true, updated: updates?.length || 0 };
  } catch (error) {
    console.error('Failed to optimize portfolio images:', error);
    return { success: false, error };
  }
}

// Generate structured data for portfolio images
export function generatePortfolioImageStructuredData(project: Portfolio) {
  if (!project.image_url) return null;
  
  return {
    "@type": "ImageObject",
    "url": project.image_url,
    "width": project.image_width || 1200,
    "height": project.image_height || 675,
    "alt": project.image_alt || generatePortfolioAltText(project),
    "description": project.image_description || generatePortfolioImageDescription(project),
    "caption": project.image_caption || generatePortfolioImageCaption(project)
  };
}

// Check if portfolio image needs SEO optimization
export function needsPortfolioImageOptimization(project: Portfolio): boolean {
  if (!project.image_url) return false;
  
  return (
    !project.image_alt ||
    !project.image_title ||
    (project.image_seo_score || 0) < 80
  );
}

// Get portfolio image SEO recommendations
export function getPortfolioImageSeoRecommendations(project: Portfolio): string[] {
  const recommendations: string[] = [];
  
  if (!project.image_url) {
    recommendations.push('Add a project showcase image');
    return recommendations;
  }
  
  if (!project.image_alt || project.image_alt.length < 10) {
    recommendations.push('Add descriptive alt text with project and client details');
  }
  
  if (!project.image_title) {
    recommendations.push('Add image title with client context');
  }
  
  if (!project.image_description) {
    recommendations.push('Add image description for better context');
  }
  
  if (!project.client_name) {
    recommendations.push('Add client name for credibility boost');
  }
  
  if (!project.category) {
    recommendations.push('Add project category for better organization');
  }
  
  if (!project.technologies) {
    recommendations.push('Add technology stack information');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Portfolio image SEO is fully optimized! 🎉');
  }
  
  return recommendations;
}

// Get portfolio image format from URL
export function getPortfolioImageFormat(url: string): string {
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

// Check portfolio image SEO score category
export function getPortfolioImageScoreCategory(score: number): string {
  if (score >= 80) return 'Excellent ✅';
  if (score >= 60) return 'Good 👍';
  if (score >= 40) return 'Needs Improvement 🔧';
  return 'Poor ❌';
} 