import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { getHeroSectionWithRevalidation } from "@/lib/hero-utils";
import { getCompanyInfoWithRevalidation } from "@/lib/company-utils";
import { getSeoMetadataWithRevalidation, generateMetadata as generateSeoMetadata } from "@/lib/seo-utils";
import { generatePageSchema } from "@/lib/schema-utils";
import { Brain, Code2, Search, Palette, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import AutomationPromoSection from "@/components/AutomationPromoSection";

// Force fresh data on every request and disable static optimization
export const revalidate = 0;
export const dynamic = 'force-dynamic';

// ✅ Dynamic SEO metadata from database
export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSeoMetadataWithRevalidation('/services');
  return generateSeoMetadata(seoData, {
    title: "Our Services - EtherCore",
    description: "Discover our professional services in web development, AI automation, and SEO optimization.",
    keywords: "web development, AI automation, digital solutions, SEO optimization, UX/UI design, technology solutions",
  });
}

// ✅ Icons Mapping
const serviceIcons = {
  'AI Automation': Brain,
  'Web Development': Code2,
  'SEO Optimization': Search,
  'UX/UI Design': Palette,
};

// ✅ Fetch services from Supabase (runs on server)
async function getServices() {
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

  return services || [];
}

// ✅ Fetch data for services page
async function getData() {
  const [services, hero, companyInfo] = await Promise.all([
    getServices(),
    getHeroSectionWithRevalidation('/services'),
    getCompanyInfoWithRevalidation()
  ]);

  return { services, hero, companyInfo };
}

// ✅ Services Page (Server Component)
export default async function ServicesPage() {
  const { services, hero, companyInfo } = await getData();
  
  // Generate schema markup for services page
  const schemas = generatePageSchema('services', {
    companyInfo,
    hero,
    services
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
      
      <main className="min-h-screen pt-20">
      {/* ✅ Hero Section with Animated Background */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-slow-spin">
            <div className="absolute w-full h-24 top-1/2 left-0 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent 
              blur-2xl transform -rotate-45"></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-teal-300 to-blue-400 
            bg-clip-text text-transparent">
            {hero?.headline || "Our Digital Solutions"}
          </h1>
          <h2 className="text-xl text-center text-gray-400 max-w-3xl mx-auto">
            {hero?.subheadline || "Transform Your Business"}
          </h2>
          {hero?.description && (
            <p className="text-lg text-center text-gray-500 max-w-3xl mx-auto mt-4">
              {hero.description}
            </p>
          )}
        </div>
      </section>

      {/* ✅ Services Grid */}
      <section className="py-20 px-4 bg-[#0d1424]">
        <div className="max-w-6xl mx-auto">
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
                    
                    {/* Features List - Fixed Height */}
                    <div className="mb-8 h-32 flex flex-col justify-start">
                      <div className="flex flex-col items-center space-y-3">
                        {service.features1 && (
                          <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 flex items-start text-sm">
                            <Check className="w-4 h-4 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{service.features1}</span>
                          </div>
                        )}
                        {service.features2 && (
                          <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 flex items-start text-sm">
                            <Check className="w-4 h-4 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{service.features2}</span>
                          </div>
                        )}
                        {service.features3 && (
                          <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 flex items-start text-sm">
                            <Check className="w-4 h-4 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{service.features3}</span>
                          </div>
                        )}
                      </div>
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

      {/* Automation Promo Section */}
      <AutomationPromoSection />

      {/* ✅ CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-teal-300 to-blue-400 
            bg-clip-text text-transparent">
            Ready to Transform Your Business?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Get in touch with us today and let&apos;s discuss how we can help you achieve your goals.
          </p>
          
          <div className="relative group inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-500 
              rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 
              group-hover:duration-200"></div>
            <Link 
              href={hero?.primary_cta_url || "/contact"}
              className="relative inline-flex items-center px-8 py-4 bg-[#0a0f1a] rounded-xl
                text-lg font-semibold overflow-hidden button-shine group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-blue-500/20 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center space-x-2">
                <span className="bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent 
                  group-hover:from-white group-hover:to-white transition-all duration-300">
                  {hero?.primary_cta_text || "Schedule a Consultation"}
                </span>
                <ArrowRight className="w-5 h-5 text-teal-400 group-hover:text-white transform 
                  group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
