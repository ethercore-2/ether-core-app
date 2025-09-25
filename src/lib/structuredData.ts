import { Blog } from "@/types/blog";

export function generateStructuredData(blog: Blog) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.content.slice(0, 150) + "...",
    image: blog.image_url,
    datePublished: blog.published_at,
    author: {
      "@type": "Organization",
      name: "EtherCore"
    }
  };
} 