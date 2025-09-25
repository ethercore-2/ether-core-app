import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { getHeroSectionWithRevalidation } from "@/lib/hero-utils";
import { getCompanyInfoWithRevalidation } from "@/lib/company-utils";
import { getSeoMetadataWithRevalidation, generateMetadata as generateSeoMetadata } from "@/lib/seo-utils";
import { generatePageSchema } from "@/lib/schema-utils";
import BlogClient from "@/components/BlogClient";

// Force fresh data on every request
export const revalidate = 0;

// ✅ Dynamic SEO metadata from database
export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSeoMetadataWithRevalidation('/blog');
  return generateSeoMetadata(seoData, {
    title: "Blog - Insights & Updates",
    description: "Read the latest articles and industry trends from the EtherCore team.",
    keywords: "blog, insights, updates, technology, web development, AI automation",
    openGraph: {
      title: "Blog - Insights & Updates",
      description: "Read the latest articles and industry trends from the EtherCore team.",
      url: "https://ether-core.com/blog",
      siteName: "EtherCore",
      images: [
        {
          url: "https://www.ether-core.com/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: "EtherCore Blog"
        }
      ]
    }
  });
}

// ✅ Fetch Data (Runs on the Server)
async function getData() {
  const [{ data: blogs }, hero, companyInfo] = await Promise.all([
    supabase.from("blogs").select("*").order("published_at", { ascending: false }),
    getHeroSectionWithRevalidation('/blog'),
    getCompanyInfoWithRevalidation()
  ]);

  return { blogs: blogs || [], hero, companyInfo };
}

// ✅ Server Component (Passes Data to BlogClient)
export default async function BlogPage() {
  const { blogs, hero, companyInfo } = await getData();
  
  // Generate schema markup for blog page
  const schemas = generatePageSchema('blog', {
    companyInfo,
    hero,
    blogs
  });
  
  return (
    <>
      {/* Schema Markup */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
      <BlogClient blogs={blogs} hero={hero} />
    </>
  );
}
