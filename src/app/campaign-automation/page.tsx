import { Metadata, Viewport } from "next";
import { supabase } from "@/lib/supabase";
import { getHeroSectionWithRevalidation } from "@/lib/hero-utils";
import { getCompanyInfoWithRevalidation } from "@/lib/company-utils";
import { generatePageSchema } from "@/lib/schema-utils";
import { getAutomationPromoWithRevalidation, generateAutomationPromoSchema } from "@/lib/promo-automation-utils";
import AutomationPromoSection from '@/components/AutomationPromoSection';
import dynamic from 'next/dynamic';
// Image import removed as it's not used in this component
import Link from "next/link";
import { Calendar, CheckCircle } from "lucide-react";

// Dynamic imports for performance
const CampaignAutomation = dynamic(() => import('@/components/CampaignAutomation'), {
  loading: () => <div className="min-h-screen bg-[#0a0f1a] animate-pulse" />,
});

const AutomationGallery = dynamic(() => import('@/components/AutomationGallery'), {
  loading: () => <div className="py-20 bg-[#0d1424] animate-pulse" />,
});

const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  loading: () => <div className="h-64 bg-gray-800/50 animate-pulse rounded-lg" />,
});

// Separate viewport export
export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  };
}

// SEO metadata for campaign page
export async function generateMetadata(): Promise<Metadata> {
  const { data: campaignVideo } = await supabase
    .from('campaign_videos')
    .select('*')
    .eq('page_slug', 'campaign-automation')
    .eq('is_active', true)
    .single();

  const title = campaignVideo?.meta_title || "AI Automation UK - Business Process Automation & AI Solutions | EtherCore";
  const description = campaignVideo?.meta_description || "Professional AI automation services in the UK. Streamline business processes with custom AI solutions, chatbots, workflow automation, and data processing. Free consultation included - reduce costs, increase productivity, and scale your operations with intelligent automation.";
  const keywords = campaignVideo?.video_keywords || "AI automation UK, business process automation, artificial intelligence, workflow automation, AI chatbots, business automation London, process optimization, RPA, intelligent automation, AI solutions, machine learning, automation consulting, digital transformation, productivity automation, cost reduction";
  const imageUrl = campaignVideo?.video_thumbnail_url || "https://www.ether-core.com/android-chrome-512x512.png";

  return {
    title,
    description,
    keywords,
    authors: [{ name: "EtherCore AI Team" }],
    creator: "EtherCore",
    publisher: "EtherCore",
    category: "AI Automation",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: title,
      description: description,
      url: "https://ether-core.com/campaign-automation",
      siteName: "EtherCore - AI Automation",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "EtherCore AI Automation - Business Process Automation Solutions",
        },
        {
          url: "https://www.ether-core.com/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: "EtherCore Logo - AI Automation Agency",
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
      canonical: 'https://ether-core.com/campaign-automation',
      languages: {
        'en-GB': 'https://ether-core.com/campaign-automation',
        'en-US': 'https://ether-core.com/campaign-automation',
      },
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'theme-color': '#7c3aed',
      'msapplication-TileColor': '#7c3aed',
      'application-name': 'EtherCore AI',
      'apple-mobile-web-app-title': 'EtherCore AI',
      'format-detection': 'telephone=no',
      'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    },
  };
}

// Data fetching function
async function getData() {
  try {
    const [
      { data: campaignVideo },
      { data: testimonials },
      { data: services },
      hero,
      companyInfo,
      automationPromo
    ] = await Promise.all([
      supabase.from('campaign_videos').select('*').eq('page_slug', 'campaign-automation').eq('is_active', true).single(),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }).limit(6),
      supabase.from('services').select('*').eq('is_active', true).order('created_at', { ascending: true }),
      getHeroSectionWithRevalidation('/campaign-automation'),
      getCompanyInfoWithRevalidation(),
      getAutomationPromoWithRevalidation()
    ]);

    return {
      campaignVideo: campaignVideo || null,
      testimonials: testimonials || [],
      services: services || [],
      hero,
      companyInfo,
      automationPromo
    };
  } catch (error) {
    console.error('Error fetching Automation campaign data:', error);
    return {
      campaignVideo: null,
      testimonials: [],
      services: [],
      hero: null,
      companyInfo: null,
      automationPromo: null
    };
  }
}

// Force fresh data on every request
export const revalidate = 0;

export default async function CampaignAutomationPage() {
  const { campaignVideo, testimonials, services, hero, companyInfo, automationPromo } = await getData();
  
  // Generate comprehensive schema markup for Automation campaign page
  const schemas: Record<string, unknown>[] = [
    // Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "EtherCore",
      "url": "https://ether-core.com",
      "logo": "https://www.ether-core.com/android-chrome-512x512.png",
      "description": "Professional AI automation and workflow optimization services",
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
    // LocalBusiness Schema for AI Automation Services
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "EtherCore AI Automation",
      "image": "https://www.ether-core.com/android-chrome-512x512.png",
      "url": "https://ether-core.com/campaign-automation",
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
      "name": "AI Business Automation & Workflow Optimization",
      "description": "Custom AI automation solutions to streamline business processes and increase efficiency",
      "provider": {
        "@type": "Organization",
        "name": "EtherCore"
      },
      "areaServed": "Worldwide",
      "serviceType": "AI Automation Services",
      "offers": {
        "@type": "Offer",
        "name": "Free Automation Consultation",
        "description": "30-minute consultation to discuss your automation needs and opportunities",
        "price": "0",
        "priceCurrency": "GBP"
      }
    },
    // FAQ Schema for AI Automation Services
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What types of business processes can be automated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We can automate various processes including customer service with AI chatbots, email marketing workflows, data processing and reporting, lead generation and qualification, inventory management, and repetitive administrative tasks."
          }
        },
        {
          "@type": "Question",
          "name": "How much can automation save my business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Businesses typically see 20-60% reduction in operational costs and 3-5x increase in productivity. ROI varies by industry and implementation scope, but most clients see positive returns within 6-12 months."
          }
        },
        {
          "@type": "Question",
          "name": "Is AI automation suitable for small businesses?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We design scalable automation solutions for businesses of all sizes. Small businesses often see the biggest impact from automation as it allows them to compete with larger companies without increasing headcount."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to implement automation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Implementation timeline depends on complexity. Simple chatbots can be deployed in 1-2 weeks, while comprehensive workflow automation may take 6-12 weeks. We provide detailed project timelines during consultation."
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
          "name": "AI Automation",
          "item": "https://ether-core.com/campaign-automation"
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
      "name": campaignVideo?.meta_title || "AI Automation Services - Streamline Your Business",
      "description": campaignVideo?.meta_description || "Custom AI automation solutions to streamline business processes",
      "url": "https://ether-core.com/campaign-automation",
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
    projects: []
  }) as Record<string, unknown>[];

  // Add video schema if available
  if (campaignVideo?.video_schema) {
    schemas.push(campaignVideo.video_schema as Record<string, unknown>);
  }

  // Add automation promo schema if available
  if (automationPromo && automationPromo.title && automationPromo.price_amount) {
    schemas.push(generateAutomationPromoSchema(automationPromo) as Record<string, unknown>);
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
        <CampaignAutomation campaignData={campaignVideo} />

        {/* Automation Promo Section - Database Driven */}
        <AutomationPromoSection initialData={automationPromo} />

        {/* Automation Gallery Section - Database Driven */}
        <AutomationGallery 
          sectionTitle="Our AI Automation Solutions"
          sectionSubtitle="Discover how our specialized automation services can transform your business operations"
          ctaText="Schedule Free Automation Consultation"
          ctaUrl={campaignVideo?.cta_button_url || "https://calendly.com/ethercore/automation-consultation"}
        />

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 bg-gradient-to-r 
              from-purple-300 to-violet-400 bg-clip-text text-transparent px-2">
              CLIENT TESTIMONIALS
            </h2>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="group relative w-full max-w-sm sm:max-w-80 p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#0d2231]/80 to-[#1a2438]/80 
                    backdrop-blur-sm hover:from-purple-600/10 hover:to-violet-600/10 
                    transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20
                    border border-purple-500/5 hover:border-purple-500/20 hover:scale-105 text-center"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center justify-center mb-4 relative">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 transform group-hover:scale-110 transition-transform duration-300"
                        style={{ transitionDelay: `${i * 50}ms` }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-300 italic mb-4 sm:mb-6 relative z-10 group-hover:text-gray-200 transition-colors text-center text-sm sm:text-base">
                    &quot;{testimonial.testimonial}&quot;
                  </p>

                  {/* Client Name */}
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 
                      flex items-center justify-center text-white font-semibold text-base sm:text-lg
                      group-hover:scale-110 transition-transform duration-300 mb-2 sm:mb-3">
                      {testimonial.client_name.charAt(0)}
                    </div>
                    <p className="font-semibold bg-gradient-to-r from-purple-400 to-violet-400 
                      bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-violet-300 text-center text-sm sm:text-base">
                      {testimonial.client_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conversion Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-[#0a0f1a] relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
              {/* Left Column - Automation Consultation CTA */}
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-300 to-violet-400 bg-clip-text text-transparent px-2">
                  Ready to Automate Your Business?
                </h2>
                <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 px-4">
                  Schedule a free automation consultation and discover how AI can transform your operations. 
                  No obligation, just expert insights tailored to your business needs.
                </p>

                {/* Benefits List */}
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-w-md mx-auto">
                  {[
                    "Free 30-minute consultation",
                    "Custom automation strategy",
                    "ROI analysis and projections",
                    "Implementation roadmap"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3 justify-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                      <span className="text-gray-300 text-sm sm:text-base">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Automation Consultation CTA */}
                <Link
                  href={campaignVideo?.cta_button_url || "https://calendly.com/ethercore/automation-consultation"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-violet-500 
                    text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:from-purple-600 hover:to-violet-600 
                    transition-all duration-300 transform hover:scale-105 shadow-xl sm:shadow-2xl hover:shadow-purple-500/25"
                >
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Schedule Free Consultation
                </Link>

                {/* Internal Links Section */}
                <div className="mt-8 pt-6 border-t border-purple-500/20">
                  <p className="text-gray-400 text-sm mb-4">Explore our other services:</p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <Link 
                      href="/campaign-seo" 
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline"
                    >
                      SEO Services
                    </Link>
                    <Link 
                      href="/campaign-web" 
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline"
                    >
                      Web Development
                    </Link>
                    <Link 
                      href="/services" 
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline"
                    >
                      All Services
                    </Link>
                    <Link 
                      href="/projects" 
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline"
                    >
                      Case Studies
                    </Link>
                    <Link 
                      href="/blog" 
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline"
                    >
                      AI Blog
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="bg-[#0d2231]/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-purple-500/10">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-r from-purple-300 to-violet-400 bg-clip-text text-transparent">
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