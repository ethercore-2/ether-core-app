import { Metadata, Viewport } from "next";
import { supabase } from "@/lib/supabase";
import { getHeroSectionWithRevalidation } from "@/lib/hero-utils";
import { getCompanyInfoWithRevalidation } from "@/lib/company-utils";
import { generatePageSchema } from "@/lib/schema-utils";
import { getWebPromoWithRevalidation, generateWebPromoSchema, getEcommercePromoWithRevalidation } from "@/lib/promo-utils";
import WebPromoSection from '@/components/WebPromoSection';
import EcommercePromoSection from '@/components/EcommercePromoSection';
import Testimonials from '@/components/Testimonials';
import dynamic from 'next/dynamic';
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Code2, Calendar } from "lucide-react";

// Dynamic imports for performance
const CampaignWeb = dynamic(() => import('@/components/CampaignWeb'), {
  loading: () => <div className="min-h-screen bg-[#0a0f1a] animate-pulse" />,
});

const TechStack = dynamic(() => import('@/components/TechStack'), {
  loading: () => <div className="h-32 bg-gray-800/50 animate-pulse rounded-lg" />,
});

const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  loading: () => <div className="h-64 bg-gray-800/50 animate-pulse rounded-lg" />,
});

// CampaignVideo interface is imported from campaign-utils

// SEO metadata for campaign page
export async function generateMetadata(): Promise<Metadata> {
  const { data: campaignVideo } = await supabase
    .from('campaign_videos')
    .select('*')
    .eq('page_slug', 'campaign-web')
    .eq('is_active', true)
    .single();

  const title = campaignVideo?.meta_title || "Web Development UK - Custom Websites & Mobile Apps | EtherCore";
  const description = campaignVideo?.meta_description || "Professional web development services in the UK. Custom websites, mobile applications, and e-commerce solutions. Free consultation included - modern technology stack, responsive design, SEO optimization, and ongoing support. Transform your business with expert web development.";
  const keywords = campaignVideo?.video_keywords || "web development UK, website design London, custom websites, mobile app development, e-commerce development, responsive web design, Next.js development, React development, web applications, digital solutions, website maintenance, web developer, frontend development, backend development, full-stack development";
  const imageUrl = campaignVideo?.video_thumbnail_url || "https://www.ether-core.com/android-chrome-512x512.png";

  return {
    title,
    description,
    keywords,
    authors: [{ name: "EtherCore Development Team" }],
    creator: "EtherCore",
    publisher: "EtherCore",
    category: "Web Development",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: title,
      description: description,
      url: "https://ether-core.com/campaign-web",
      siteName: "EtherCore - Web Development",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "EtherCore Web Development - Custom Websites & Applications",
        },
        {
          url: "https://www.ether-core.com/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: "EtherCore Logo - Web Development Agency",
        },
      ],
      type: 'website',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl],
      creator: '@EtherCore',
      site: '@EtherCore',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: 'https://ether-core.com/campaign-web',
      languages: {
        'en-GB': 'https://ether-core.com/campaign-web',
        'en-US': 'https://ether-core.com/campaign-web',
      },
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'theme-color': '#0d9488',
      'msapplication-TileColor': '#0d9488',
      'application-name': 'EtherCore Web',
      'apple-mobile-web-app-title': 'EtherCore Web',
      'format-detection': 'telephone=no',
      'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    },
  };
}

// Separate viewport export
export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  };
}

// Data fetching function
async function getData() {
  try {
    const [
      { data: campaignVideo },
      { data: portfolio },
      { data: testimonials },
      { data: services },
      hero,
      companyInfo,
      webPromo,
      ecommercePromo
    ] = await Promise.all([
      supabase.from('campaign_videos').select('*').eq('page_slug', 'campaign-web').eq('is_active', true).single(),
      supabase.from('portfolio').select('*').in('title', ['Mahonia Decor', 'BetterSelf', 'IndoMath']).order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }).limit(6),
      supabase.from('services').select('*').eq('is_active', true).order('created_at', { ascending: true }),
      getHeroSectionWithRevalidation('/campaign-web'),
      getCompanyInfoWithRevalidation(),
      getWebPromoWithRevalidation(),
      getEcommercePromoWithRevalidation()
    ]);

    return {
      campaignVideo: campaignVideo || null,
      portfolio: portfolio || [],
      testimonials: testimonials || [],
      services: services || [],
      hero,
      companyInfo,
      webPromo,
      ecommercePromo
    };
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    return {
      campaignVideo: null,
      portfolio: [],
      testimonials: [],
      services: [],
      hero: null,
      companyInfo: null,
      webPromo: null,
      ecommercePromo: null
    };
  }
}

// Force fresh data on every request
export const revalidate = 0;

export default async function CampaignWebPage() {
  const { campaignVideo, portfolio, testimonials, services, hero, companyInfo, webPromo, ecommercePromo } = await getData();
  
  // Generate comprehensive schema markup for campaign page
  const schemas: Record<string, unknown>[] = [
    // Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "EtherCore",
      "url": "https://ether-core.com",
      "logo": "https://www.ether-core.com/android-chrome-512x512.png",
      "description": "Professional web development and AI automation services",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+44-7700-900123",
        "contactType": "customer service",
        "availableLanguage": "English"
      },
      "sameAs": [
        "https://www.linkedin.com/company/ethercore",
        "https://twitter.com/ethercore"
      ]
    },
    // LocalBusiness Schema for Web Development Services
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "EtherCore Web Development",
      "image": "https://www.ether-core.com/android-chrome-512x512.png",
      "url": "https://ether-core.com/campaign-web",
      "telephone": "+44-7700-900123",
      "priceRange": "£££",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "GB"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "51.5074",
        "longitude": "-0.1278"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "51.5074",
          "longitude": "-0.1278"
        },
        "geoRadius": "50000"
      }
    },
    // Service Schema
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Web Development & AI Automation Services",
      "description": "Transform your business with professional web development, AI automation, and digital solutions",
      "provider": {
        "@type": "Organization",
        "name": "EtherCore"
      },
      "areaServed": "Worldwide",
      "serviceType": "Web Development",
      "offers": {
        "@type": "Offer",
        "name": "Free Consultation",
        "description": "30-minute free consultation for web development and AI automation services",
        "price": "0",
        "priceCurrency": "GBP"
      }
    },
    // FAQ Schema for Web Development Services
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What's included in the free consultation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our free 30-minute consultation includes project scope analysis, technology recommendations, timeline estimation, cost breakdown, and strategic advice for your web development or AI automation project."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to build a website?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Website development timeline varies based on complexity. A basic website takes 2-4 weeks, while complex applications with custom features can take 8-16 weeks. We provide detailed timelines during the consultation."
          }
        },
        {
          "@type": "Question",
          "name": "Do you provide ongoing support and maintenance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we offer comprehensive maintenance packages including security updates, performance optimization, content updates, backup management, and technical support to keep your website running smoothly."
          }
        },
        {
          "@type": "Question",
          "name": "What technologies do you use for web development?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We use modern technologies including Next.js, React, TypeScript, Node.js, Python, and cloud platforms like Vercel and AWS. We choose the best technology stack based on your specific project requirements."
          }
        }
      ]
    },
    // BreadcrumbList Schema
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://ether-core.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Web Development",
          "item": "https://ether-core.com/campaign-web"
        }
      ]
    },
    // VideoObject Schema (if video exists)
    ...(campaignVideo ? [{
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": campaignVideo.meta_title || campaignVideo.header_text,
      "description": campaignVideo.meta_description || campaignVideo.subtitle_text,
      "thumbnailUrl": campaignVideo.video_thumbnail_url,
      "contentUrl": campaignVideo.video_url,
      "uploadDate": new Date().toISOString(),
      "duration": campaignVideo.video_duration ? `PT${campaignVideo.video_duration}S` : undefined,
      "publisher": {
        "@type": "Organization",
        "name": "EtherCore",
        "logo": "https://www.ether-core.com/android-chrome-512x512.png"
      }
    }] : []),
    // WebPage Schema
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": campaignVideo?.meta_title || "Transform Your Business with EtherCore",
      "description": campaignVideo?.meta_description || "Professional web development & AI automation services",
      "url": "https://ether-core.com/campaign-web",
      "isPartOf": {
        "@type": "WebSite",
        "name": "EtherCore",
        "url": "https://ether-core.com"
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": campaignVideo?.video_thumbnail_url || "https://www.ether-core.com/android-chrome-512x512.png"
      }
    }
  ];

  // Add existing schemas
  const existingSchemas = generatePageSchema('home', {
    companyInfo,
    hero,
    services,
    projects: portfolio
  }) as Record<string, unknown>[];

  // Add video schema if available
  if (campaignVideo?.video_schema) {
    schemas.push(campaignVideo.video_schema as Record<string, unknown>);
  }

  // Add web promo schema if available
  if (webPromo && webPromo.title && webPromo.price_amount) {
    schemas.push(generateWebPromoSchema(webPromo) as Record<string, unknown>);
  }

  // Combine all schemas
  const allSchemas = [...schemas, ...existingSchemas];

  return (
    <>
      {/* Critical Resource Preloading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://calendly.com" />
      <link rel="dns-prefetch" href="https://commondatastorage.googleapis.com" />
      
      {/* Preload critical video thumbnail */}
      {campaignVideo?.video_thumbnail_url && (
        <link rel="preload" as="image" href={campaignVideo.video_thumbnail_url} />
      )}

      {/* Schema Markup */}
      {allSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}

      <main className="min-h-screen pt-20">
        {/* Hero Section with Video */}
        <CampaignWeb campaignData={campaignVideo} />

        {/* Website Promo Section - Database Driven */}
        <WebPromoSection initialData={webPromo} />

        {/* E-commerce Promo Section - Database Driven */}
        <EcommercePromoSection initialData={ecommercePromo} />

        {/* Website Promo Section - Tech Stack */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-[#0d1424] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a]" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent px-2">
                Built with Modern Technology
              </h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto px-4">
                We use cutting-edge technologies to deliver fast, secure, and scalable web solutions that grow with your business.
              </p>
            </div>
            <TechStack />
          </div>
        </section>

        {/* Project Highlights */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-[#0d1424]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 bg-gradient-to-r 
              from-teal-300 to-blue-400 bg-clip-text text-transparent px-2">
              FEATURED PROJECTS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
              {portfolio.map((project) => (
                <div 
                  key={project.id} 
                  className="group relative w-full max-w-sm rounded-xl overflow-hidden bg-[#0d2231] hover:bg-[#1a2438] 
                    transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/10
                    border border-teal-500/5 hover:border-teal-500/20 h-full flex flex-col"
                >
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1a]/80 to-[#0a0f1a] 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  
                  {/* Image Container - Optimized for logos and different image types */}
                  <div className="relative w-full h-40 sm:h-48 overflow-hidden bg-gray-900/20 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d2231]/60 to-transparent z-10" />
                    <Image
                      src={project.image_url}
                      alt={project.image_alt || `${project.title} - ${project.client_name || 'EtherCore Project'}`}
                      title={project.image_title || `${project.title} - ${project.client_name || 'EtherCore Project'}`}
                      width={384}
                      height={192}
                      className="object-contain w-full h-full max-w-[85%] max-h-[85%] transform group-hover:scale-105 transition-transform duration-700 p-3 sm:p-4"
                      priority={portfolio.indexOf(project) < 2}
                      quality={80}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading={portfolio.indexOf(project) < 2 ? "eager" : "lazy"}
                      fetchPriority={portfolio.indexOf(project) === 0 ? "high" : "auto"}
                    />
                    
                    {/* Floating Tag */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 transform -translate-y-2 opacity-0 
                      group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="px-2 sm:px-3 py-1 bg-teal-500/20 backdrop-blur-sm rounded-full 
                        border border-teal-400/20 flex items-center space-x-1">
                        <Code2 className="w-2 h-2 sm:w-3 sm:h-3 text-teal-400" />
                        <span className="text-xs text-teal-300">Project</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-4 sm:p-6 z-20 text-center flex-1 flex flex-col justify-between">
                    {/* Animated Line */}
                    <div className="absolute top-0 left-4 right-4 sm:left-6 sm:right-6 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent 
                      transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    
                    <h3 className="text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r from-teal-300 to-blue-400 
                      bg-clip-text text-transparent group-hover:from-teal-400 group-hover:to-blue-500 
                      transition-colors duration-300">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-4 text-sm sm:text-base">
                      {project.description}
                    </p>
                    
                    {project.project_url && (
                      <div className="transform translate-y-2 opacity-0 group-hover:translate-y-0 
                        group-hover:opacity-100 transition-all duration-300 delay-100">
                        <a 
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg
                            bg-gradient-to-r from-teal-500/10 to-blue-500/10
                            hover:from-teal-500/20 hover:to-blue-500/20
                            text-teal-400 hover:text-teal-300 
                            transition-all duration-300 group/link button-shine text-sm"
                        >
                          <span>View Project</span>
                          <svg 
                            className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover/link:translate-x-1 transition-transform duration-300"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials testimonials={testimonials} title="CLIENT TESTIMONIALS" className="py-12 sm:py-16 md:py-20" />

        {/* Conversion Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-[#0a0f1a] relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
              {/* Left Column - Calendly CTA */}
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent px-2">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 px-4">
                  Schedule a free consultation and discover how we can help you achieve your digital goals. 
                  No obligation, just expert advice tailored to your needs.
                </p>

                {/* Benefits List */}
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-w-md mx-auto">
                  {[
                    "Free 30-minute consultation",
                    "Custom solution recommendations",
                    "Transparent pricing with no hidden fees",
                    "Fast turnaround times"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3 justify-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300 text-sm sm:text-base">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Calendly CTA */}
                <Link
                  href={campaignVideo?.cta_button_url || "https://calendly.com/ethercore/consultation"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-500 to-blue-500 
                    text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:from-teal-600 hover:to-blue-600 
                    transition-all duration-300 transform hover:scale-105 shadow-xl sm:shadow-2xl hover:shadow-teal-500/25"
                >
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Schedule Free Consultation
                </Link>

                {/* Internal Links Section */}
                <div className="mt-8 pt-6 border-t border-teal-500/20">
                  <p className="text-gray-400 text-sm mb-4">Explore our other services:</p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <Link 
                      href="/campaign-seo" 
                      className="text-teal-400 hover:text-teal-300 transition-colors duration-300 hover:underline"
                    >
                      SEO Services
                    </Link>
                    <Link 
                      href="/campaign-automation" 
                      className="text-teal-400 hover:text-teal-300 transition-colors duration-300 hover:underline"
                    >
                      AI Automation
                    </Link>
                    <Link 
                      href="/services" 
                      className="text-teal-400 hover:text-teal-300 transition-colors duration-300 hover:underline"
                    >
                      All Services
                    </Link>
                    <Link 
                      href="/projects" 
                      className="text-teal-400 hover:text-teal-300 transition-colors duration-300 hover:underline"
                    >
                      Portfolio
                    </Link>
                    <Link 
                      href="/blog" 
                      className="text-teal-400 hover:text-teal-300 transition-colors duration-300 hover:underline"
                    >
                      Web Dev Blog
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="bg-[#0d2231]/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-teal-500/10">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent">
                  Or Get In Touch Directly
                </h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>


    </>
  );
} 