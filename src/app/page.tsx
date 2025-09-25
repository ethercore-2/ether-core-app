import Image from "next/image";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { getHeroSectionWithRevalidation } from '@/lib/hero-utils';
import { getCompanyInfoWithRevalidation } from '@/lib/company-utils';
import { getWebPromoWithRevalidation } from '@/lib/promo-utils';
import { getSeoMetadataWithRevalidation, generateMetadata as generateSeoMetadata } from '@/lib/seo-utils';
import { generatePageSchema } from '@/lib/schema-utils';
import NextDynamic from 'next/dynamic';
import WebPromoSection from '@/components/WebPromoSection';
import Testimonials from '@/components/Testimonials';
import { 
  Brain, 
  Code2, 
  Search, 
  Palette,
  ArrowRight,
  Calendar,
  ExternalLink,
  Github
} from 'lucide-react';
import { Metadata } from "next";

// ✅ Dynamic imports for performance optimization
const TechStack = NextDynamic(() => import('@/components/TechStack'), {
  loading: () => <div className="h-32 bg-gray-800/50 animate-pulse rounded-lg" />,
});

const GridBackground = NextDynamic(() => import('@/components/GridBackground'), {
  loading: () => <div className="h-32 bg-gray-800/50 animate-pulse rounded-lg" />,
});

const ContactForm = NextDynamic(() => import('@/components/ContactForm'), {
  loading: () => <div className="h-64 bg-gray-800/50 animate-pulse rounded-lg" />,
});

// ✅ Dynamic SEO metadata from database
export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSeoMetadataWithRevalidation('/');
  return generateSeoMetadata(seoData, {
    title: "EtherCore - Affordable Digital Solutions",
    description: "Transform your business with our web development, AI automation, and SEO services.",
    keywords: "web development, AI automation, digital solutions, SEO optimization",
  });
}

// ✅ Force revalidation for real-time data and disable static optimization
export const revalidate = 0; // Always fetch fresh data
export const dynamic = 'force-dynamic'; // Disable static optimization to prevent hydration issues

// Icon mapping - MUST match database exactly
const serviceIcons = {
  'Web Development': Code2,
  'AI Automation': Brain,
  'SEO Optimization': Search,
  'UX/UI Design': Palette,
} as const;

// ✅ Dedicated fetch functions following working pages pattern
async function getServices() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true });
  
  return services || [];
}

async function getPortfolio() {
  const { data: portfolio } = await supabase
    .from('portfolio')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);
  
  return portfolio || [];
}

async function getTestimonials() {
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);
  
  return testimonials || [];
}

async function getBlogs() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(3);
  
  return blogs || [];
}

// ✅ Enhanced fetch function with consistent pattern matching working pages
async function getData() {
  try {
    const [hero, services, portfolio, testimonials, blogs, companyInfo, webPromo] = await Promise.all([
      getHeroSectionWithRevalidation('/'),
      getServices(),           // ✅ Using dedicated function
      getPortfolio(),          // ✅ Using dedicated function  
      getTestimonials(),       // ✅ Using dedicated function
      getBlogs(),             // ✅ Using dedicated function
      getCompanyInfoWithRevalidation(),
      getWebPromoWithRevalidation()
    ]);

    return {
      hero,
      services,      // ✅ Direct return (no .data extraction needed)
      portfolio,     // ✅ Direct return (no .data extraction needed)
      testimonials,  // ✅ Direct return
      blogs,         // ✅ Direct return
      companyInfo,
      webPromo
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      hero: null,
      services: [],
      portfolio: [],
      testimonials: [],
      blogs: [],
      companyInfo: null,
      webPromo: null
    };
  }
}

export default async function Home() {
  const { hero, services, portfolio, testimonials, blogs, companyInfo, webPromo } = await getData();
  
  // Generate schema markup for homepage
  const schemas = generatePageSchema('home', {
    companyInfo,
    hero,
    services,
    blogs,
    projects: portfolio
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
      
      <main className="min-h-screen w-screen max-w-[100vw]">
        {/* Hero Section */}
        <section className="min-h-screen relative flex flex-col justify-center items-center p-4 md:p-8 w-full pt-20 md:pt-24">
          <GridBackground />
          
          {/* Hero Content */}
          <div className="relative z-20 w-full max-w-[95%] sm:max-w-[90%] md:max-w-6xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 
              bg-gradient-to-r from-teal-300 to-blue-400 text-transparent bg-clip-text animate-fade-in">
              {hero?.headline || "WELCOME TO ETHERCORE"}
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-gray-300 animate-fade-in-up">
              {hero?.subheadline || "Your Trusted Partner for Affordable Digital Solutions"}
            </h2>
            
            {/* Buttons - Stack on mobile, side by side on larger screens */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Link 
                href={hero?.primary_cta_url || "/contact"}
                className="w-full sm:w-auto button-shine bg-teal-500 text-white px-4 sm:px-6 py-3 
                  rounded-lg font-semibold hover:bg-teal-600 transition-all text-sm sm:text-base"
              >
                {hero?.primary_cta_text || "Get Started"}
              </Link>
              <Link 
                href={hero?.secondary_cta_url || "/services"}
                className="w-full sm:w-auto button-shine border border-teal-500 text-teal-400 
                  px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-teal-500/10 
                  transition-all text-sm sm:text-base"
              >
                {hero?.secondary_cta_text || "Learn More"}
              </Link>
            </div>
          </div>

          {/* TechStack - Blended into hero section */}
          <div className="relative z-20 mt-16">
            <TechStack />
          </div>
        </section>

        {/* Services */}
        <section className="py-20 px-4 bg-[#0d1424]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent">
              Our Services
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service) => {
                const IconComponent = serviceIcons[service.name as keyof typeof serviceIcons];
                return (
                  <div 
                    key={service.id} 
                    className="group relative p-8 rounded-xl bg-gradient-to-br from-[#0d2231]/80 to-[#1a2438]/80 
                      backdrop-blur-sm hover:from-teal-600/20 hover:to-blue-600/20 transition-all duration-500
                      hover:shadow-[0_0_30px_rgba(45,212,191,0.2)] overflow-hidden border border-teal-500/10
                      hover:border-teal-500/30 text-center flex flex-col h-full"
                  >
                    {/* Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600/0 via-teal-600/5 to-blue-600/0 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Icon and Title Section - Same Line */}
                    <div className="mb-6 h-16 flex items-center justify-center gap-4 flex-shrink-0">
                      {/* Icon Container */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl 
                          group-hover:bg-teal-500/30 transition-all duration-500"></div>
                        <div className="relative w-12 h-12 flex items-center justify-center 
                          bg-gradient-to-br from-teal-500 to-blue-500 rounded-full
                          group-hover:scale-110 transition-transform duration-500">
                          {IconComponent && (
                            <IconComponent className="w-6 h-6 text-white" />
                          )}
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold bg-gradient-to-r from-teal-300 to-blue-400 
                        bg-clip-text text-transparent group-hover:from-white group-hover:to-white
                        transition-colors duration-300 leading-tight">
                        {service.name}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="relative flex flex-col flex-grow">

                      {/* Description Section - Fixed Height */}
                      <div className="mb-6 h-20 flex items-center justify-center">
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-center w-full">
                          {service.description}
                        </p>
                      </div>

                      {/* CTA Section - Aligned at Bottom */}
                      <div className="mt-auto relative z-20">
                        {(service.cta_text && service.cta_url) && (
                          <Link 
                            href={service.cta_url}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg 
                              bg-gradient-to-r from-teal-500/20 to-blue-500/20 
                              border border-teal-500/30 text-teal-300 hover:text-white
                              hover:from-teal-500/30 hover:to-blue-500/30 hover:border-teal-400/50
                              transition-all duration-300 group font-medium
                              cursor-pointer relative z-30"
                          >
                            <span>{service.cta_text}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 border border-transparent 
                      group-hover:border-teal-500/30 rounded-xl transition-colors duration-500"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Website Promo Section */}
        <WebPromoSection initialData={webPromo} />

        {/* Featured Projects */}
        <section className="py-20 px-4 bg-[#0d1424]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r 
              from-teal-300 to-blue-400 bg-clip-text text-transparent">
              FEATURED PROJECTS
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolio.map((project) => (
                <div 
                  key={project.id} 
                  className="group relative rounded-xl overflow-hidden bg-[#0d2231] hover:bg-[#1a2438] 
                    transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/10
                    border border-teal-500/5 hover:border-teal-500/20"
                >
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1a]/80 to-[#0a0f1a] 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d2231] to-transparent z-10" />
                    <Image
                      src={project.image_url}
                      alt={project.image_alt || `${project.title} - ${project.client_name || 'EtherCore Project'}`}
                      title={project.image_title || `${project.title} - ${project.client_name || 'EtherCore Project'}`}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Project Type Tag */}
                    <div className="absolute top-4 left-4 z-20 transform -translate-y-2 opacity-0 
                      group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="px-3 py-1 bg-teal-500/20 backdrop-blur-sm rounded-full 
                        border border-teal-400/20 flex items-center space-x-1">
                        <Code2 className="w-3 h-3 text-teal-400" />
                        <span className="text-xs text-teal-300">{project.category || 'Project'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-6 z-20 text-center">
                    {/* Animated Line */}
                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent 
                      transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                    <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-teal-300 to-blue-400 
                      bg-clip-text text-transparent group-hover:from-white group-hover:to-white 
                      transition-colors duration-300">
                      {project.title}
                    </h3>

                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-6">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies?.split(",").map((tech: string, index: number) => (
                        <span 
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-teal-500/10 text-teal-400 
                            border border-teal-500/20"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex flex-col items-center space-y-2">
                      {project.project_url && (
                        <Link 
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-teal-400 
                            hover:text-teal-300 transition-colors duration-300 group/link"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Live Demo</span>
                        </Link>
                      )}
                      {project.github_url && (
                        <Link 
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-teal-400 
                            hover:text-teal-300 transition-colors duration-300 group/link"
                        >
                          <Github className="w-4 h-4" />
                          <span>Source Code</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials testimonials={testimonials} />

        {/* Blog Section */}
        <section className="py-20 px-4 bg-[#0d1424]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r 
              from-teal-300 to-blue-400 bg-clip-text text-transparent">
              LATEST INSIGHTS
            </h2>
            {blogs && blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Link 
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="group relative rounded-xl overflow-hidden bg-[#0d2231] hover:bg-[#1a2438] 
                      transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/10
                      border border-teal-500/5 hover:border-teal-500/20 h-full flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={blog.image_url}
                        alt={blog.title}
                        width={384}
                        height={192}
                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                        quality={80}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors duration-300">
                        {blog.title}
                      </h3>
                      <p className="text-gray-400 mb-4 flex-1 group-hover:text-gray-300 transition-colors duration-300 line-clamp-3">
                        {blog.content.substring(0, 150)}...
                      </p>
                      <div className="text-sm text-teal-400 group-hover:text-teal-300 transition-colors duration-300">
                        {new Date(blog.published_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <p>No blog posts available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r 
              from-teal-300 to-blue-400 bg-clip-text text-transparent">
              READY TO GET STARTED?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Let&apos;s discuss your project and bring your vision to life
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/contact"
                className="button-shine bg-teal-500 text-white px-8 py-4 rounded-lg font-semibold 
                  hover:bg-teal-600 transition-all text-lg"
              >
                Start Your Project
              </Link>
              <Link 
                href="https://calendly.com/ethercore/consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="button-shine border border-teal-500 text-teal-400 px-8 py-4 rounded-lg 
                  font-semibold hover:bg-teal-500/10 transition-all text-lg flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Consultation
              </Link>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>
    </>
  );
}
