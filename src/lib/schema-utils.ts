import { HeroSection, CompanyInfo } from '@/types/hero';

// Organization Schema - Base schema for the company
export function generateOrganizationSchema(companyInfo?: CompanyInfo | null) {
  if (!companyInfo) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": companyInfo.company_name,
    "description": companyInfo.description,
    "url": companyInfo.website_url,
    "logo": companyInfo.logo_url,
    "email": companyInfo.primary_email,
    "telephone": companyInfo.phone,
    "sameAs": [
      companyInfo.website_url,
      companyInfo.calendly_url
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": companyInfo.phone,
      "email": companyInfo.primary_email,
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };
}

// Website Schema - For homepage
export function generateWebsiteSchema(companyInfo?: CompanyInfo | null) {
  if (!companyInfo) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": companyInfo.company_name,
    "description": companyInfo.tagline,
    "url": companyInfo.website_url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${companyInfo.website_url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": companyInfo.company_name,
      "logo": companyInfo.logo_url
    }
  };
}

// Local Business Schema - For contact/services pages
export function generateLocalBusinessSchema(companyInfo?: CompanyInfo | null) {
  if (!companyInfo) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": companyInfo.company_name,
    "description": companyInfo.description,
    "url": companyInfo.website_url,
    "logo": companyInfo.logo_url,
    "email": companyInfo.primary_email,
    "telephone": companyInfo.phone,
    "openingHours": companyInfo.business_hours,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.5074",
      "longitude": "-0.1278"
    },
    "priceRange": "£300-£5000",
    "serviceArea": {
      "@type": "Place",
      "name": "United Kingdom"
    }
  };
}

// Service Schema - For individual services
export function generateServiceSchema(service: { name: string; description: string; price?: string }, companyInfo?: CompanyInfo | null) {
  if (!service || !companyInfo) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": companyInfo.company_name,
      "url": companyInfo.website_url
    },
    "serviceType": service.name,
    "category": "Digital Services",
    "offers": {
      "@type": "Offer",
      "price": service.price || "300",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString().split('T')[0]
    },
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    }
  };
}

// Blog Article Schema
export function generateBlogPostSchema(blog: { title: string; content: string; image_url?: string; published_at: string; updated_at?: string; slug: string; tags?: string[] }, companyInfo?: CompanyInfo | null) {
  if (!blog || !companyInfo) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.content.substring(0, 160),
    "image": blog.image_url,
    "datePublished": blog.published_at,
    "dateModified": blog.updated_at || blog.published_at,
    "author": {
      "@type": "Organization",
      "name": companyInfo.company_name,
      "url": companyInfo.website_url
    },
    "publisher": {
      "@type": "Organization",
      "name": companyInfo.company_name,
      "logo": {
        "@type": "ImageObject",
        "url": companyInfo.logo_url
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${companyInfo.website_url}/blog/${blog.slug}`
    },
    "keywords": blog.tags?.join(", ") || ""
  };
}

// Portfolio/Project Schema
export function generateCreativeWorkSchema(project: { title: string; description: string; image_url?: string; project_url?: string; created_at: string; category?: string; technologies?: string }, companyInfo?: CompanyInfo | null) {
  if (!project || !companyInfo) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": project.image_url,
    "url": project.project_url,
    "creator": {
      "@type": "Organization",
      "name": companyInfo.company_name,
      "url": companyInfo.website_url
    },
    "dateCreated": project.created_at,
    "genre": project.category || "Web Development",
    "keywords": project.technologies
  };
}

// FAQ Schema - For pages with common questions
export function generateFAQSchema(faqs: Array<{question: string, answer: string}>) {
  if (!faqs.length) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Breadcrumb Schema
export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>, baseUrl: string) {
  if (!breadcrumbs.length) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${baseUrl}${crumb.url}`
    }))
  };
}

// Combined Schema Generator for pages
export function generatePageSchema(
  pageType: 'home' | 'services' | 'contact' | 'blog' | 'projects',
  data: {
    companyInfo?: CompanyInfo | null;
    hero?: HeroSection | null;
    services?: Array<{ name: string; description: string; price?: string }>;
    blogs?: Array<{ title: string; content: string; image_url?: string; published_at: string; updated_at?: string; slug: string; tags?: string[] }>;
    projects?: Array<{ title: string; description: string; image_url?: string; project_url?: string; created_at: string; category?: string; technologies?: string }>;
    specificData?: Record<string, unknown>;
  }
) {
  const schemas = [];
  
  // Always include Organization schema
  const orgSchema = generateOrganizationSchema(data.companyInfo);
  if (orgSchema) schemas.push(orgSchema);
  
  // Page-specific schemas
  switch (pageType) {
    case 'home':
      const websiteSchema = generateWebsiteSchema(data.companyInfo);
      if (websiteSchema) schemas.push(websiteSchema);
      break;
      
    case 'services':
      const localBusinessSchema = generateLocalBusinessSchema(data.companyInfo);
      if (localBusinessSchema) schemas.push(localBusinessSchema);
      
      // Add service schemas
      data.services?.forEach(service => {
        const serviceSchema = generateServiceSchema(service, data.companyInfo);
        if (serviceSchema) schemas.push(serviceSchema);
      });
      break;
      
    case 'contact':
      const contactBusinessSchema = generateLocalBusinessSchema(data.companyInfo);
      if (contactBusinessSchema) schemas.push(contactBusinessSchema);
      break;
      
    case 'blog':
      // Add blog post schemas
      data.blogs?.forEach(blog => {
        const blogSchema = generateBlogPostSchema(blog, data.companyInfo);
        if (blogSchema) schemas.push(blogSchema);
      });
      break;
      
    case 'projects':
      // Add creative work schemas
      data.projects?.forEach(project => {
        const projectSchema = generateCreativeWorkSchema(project, data.companyInfo);
        if (projectSchema) schemas.push(projectSchema);
      });
      break;
  }
  
  return schemas;
} 