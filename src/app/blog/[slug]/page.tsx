import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Tag, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { calculateReadingTime, formatDate } from "@/lib/blog-utils";
import { getCompanyInfo } from "@/lib/company-utils";
import { generateBlogPostSchema } from "@/lib/schema-utils";
import { Metadata } from "next";
import BlogImage from "@/components/BlogImage";
import { Blog } from "@/types/blog";  // Import shared type

// Define interfaces for our data
interface RelatedPost {
  title: string;
  slug: string;
  image_url: string;
  published_at: string;
}

// This is important for Next.js static page generation
export async function generateStaticParams() {
  const { data: blogs } = await supabase.from("blogs").select("slug");
  return blogs?.map((blog) => ({ slug: blog.slug })) || [];
}

// ✅ Fetch blog post on the server
async function getBlogPost(slug: string): Promise<{ blog: Blog; relatedPosts: RelatedPost[] }> {
  const { data: blog } = await supabase.from("blogs").select("*").eq("slug", slug).single();
  if (!blog) notFound();

  const { data: relatedPosts } = await supabase
    .from("blogs")
    .select("title, slug, image_url, published_at")
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(4);

  return { 
    blog: blog as Blog,  // This cast now includes id
    relatedPosts: (relatedPosts || []) as RelatedPost[] 
  };
}

type Params = Promise<{ slug: string }>

// ✅ Page-specific SEO metadata
export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const resolvedParams = await params;
  const { blog } = await getBlogPost(resolvedParams.slug);
  
  return {
    title: `${blog.title} - EtherCore`,
    description: blog.content.slice(0, 150) + "...",
    keywords: blog.tags.join(", "),
    openGraph: {
      title: `${blog.title} - EtherCore`,
      description: blog.content.slice(0, 150) + "...",
      url: `https://ether-core.com/blog/${blog.slug}`,
      siteName: "EtherCore",
      images: [{ url: blog.image_url, width: 800, height: 600, alt: blog.title }],
    },
  };
}

// ✅ Blog Post Page Component
export default async function Page({ 
  params 
}: { 
  params: Params 
}) {
  const resolvedParams = await params;
  const { blog, relatedPosts } = await getBlogPost(resolvedParams.slug);
  const readingTime = calculateReadingTime(blog.content);
  
  // Get company info and generate enhanced schema
  const companyInfo = await getCompanyInfo();
  const blogSchema = generateBlogPostSchema(blog, companyInfo);
  
  return (
    <main className="min-h-screen p-0">
      {/* Enhanced Schema Markup */}
      {blogSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogSchema, null, 0)
          }}
        />
      )}

      {/* Blog Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center px-4 overflow-hidden">
        <Image src={blog.image_url} alt={blog.title} fill className="object-cover object-top" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/50 via-[#0a192f]/80 to-[#0a192f]" />

        {/* Title & Meta Overlay */}
        <div className="absolute bottom-12 w-full text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto">
            {blog.title}
          </h1>
          <div className="flex justify-center gap-6 text-gray-300 mt-4">
            <span className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {formatDate(blog.published_at)}
            </span>
            <span className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {readingTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* Back Button & Tags */}
      <div className="max-w-4xl mx-auto px-4 mt-8 flex justify-between items-center flex-wrap">
        {/* Back to Blog Button */}
        <Link href="/blog" className="inline-flex items-center text-white hover:text-teal-300 transition-colors duration-300 group bg-teal-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Blog
        </Link>

        {/* Blog Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: string) => (
              <div key={tag} className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/20 flex items-center space-x-1">
                <Tag className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-300">{tag}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Blog Content */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Related Posts (Sidebar) */}
        <aside className="lg:col-span-1 space-y-6 bg-[#0d1b2a] p-6 rounded-lg">
          {relatedPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group bg-[#162a40] rounded-lg overflow-hidden shadow-md hover:shadow-teal-500/10 transition">
              <div className="relative h-28">
                <Image src={post.image_url} alt={post.title} fill className="object-cover transform group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">{post.title}</h3>
                <p className="text-gray-400 text-xs mt-1">{formatDate(post.published_at)}</p>
              </div>
            </Link>
          ))}
          {/* See All Posts Button */}
          <div className="text-center mt-6">
            <Link href="/blog" className="inline-block bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-400 transition">
              See All Posts
            </Link>
          </div>
        </aside>

        {/* Blog Content */}
        <article className="lg:col-span-2">
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed tracking-wide space-y-6">
            <ReactMarkdown
              components={{
                h1: ({ ...props }) => <h1 className="text-5xl font-bold text-white mb-6 mt-10" {...props} />,
                h2: ({ ...props }) => <h2 className="text-4xl font-semibold text-teal-300 mb-6 mt-12" {...props} />,
                h3: ({ ...props }) => <h3 className="text-3xl font-semibold text-white mb-5 mt-10" {...props} />,
                p: ({ ...props }) => <p className="text-lg leading-8 mb-4 first:mt-0" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc list-inside space-y-2 text-gray-300" {...props} />,
                li: ({ ...props }) => <li className="ml-4 pl-2 border-l-2 border-teal-400" {...props} />,
                hr: () => null,
                img: ({ ...props }) => {
                  const { src, alt } = props;
                  if (!src) {
                    return <BlogImage src="default-image-url.jpg" alt={alt || "Default Image"} />;
                  }
                  return <BlogImage 
                    src={src} 
                    alt={alt || blog.image_alt || "Blog Image"}
                    title={blog.image_title}
                    caption={blog.image_caption}
                  />;
                },
                div: ({ ...props }) => <div {...props} />,
              }}
            >
              {blog.content}
            </ReactMarkdown>
            <button className="flex items-center hover:text-teal-400 transition-colors duration-300">
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </button>
          </div>

          {/* New CTA Button */}
          <div className="text-center mt-6 mr-8 pb-8">
            <Link 
              href="/contact" 
              className="relative inline-flex items-center px-8 py-4 bg-teal-500 text-white rounded-full font-semibold overflow-hidden transition duration-300 hover:bg-teal-400"
            >
              <span className="relative z-10">Get in Touch</span>
              <span className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 opacity-50 group-hover:opacity-100 transition duration-1000" />
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
