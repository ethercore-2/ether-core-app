import { supabase } from "@/lib/supabase";
import { getHeroSection } from "@/lib/hero-utils";
import { getCompanyInfo } from "@/lib/company-utils";
import { getSeoMetadata, generateMetadata as generateSeoMetadata } from "@/lib/seo-utils";
import { generatePageSchema } from "@/lib/schema-utils";
import { Brain, Code2, Search, Palette, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

// ✅ Dynamic SEO metadata from database
export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSeoMetadata('/services');
  return generateSeoMetadata(seoData, {
    title: "Our Services - EtherCore",
    description: "Discover our professional services in web development, AI automation, and SEO optimization.",
    keywords: "web development, AI automation, digital solutions, SEO optimization, UX/UI design, technology solutions",
  });
}

// ✅ Icons Mapping
const serviceIcons = {
  "AI Automation": Brain,
  "Modern Web Development": Code2,
  "SEO Optimization": Search,
  "UX/UI Design": Palette,
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
    getHeroSection('/services'),
    getCompanyInfo()
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
                    hover:border-teal-500/30 text-center"
                >
                  {/* Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600/0 via-teal-600/5 to-blue-600/0 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon Container */}
                  <div className="relative mb-8 inline-block">
                    <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl 
                      group-hover:bg-teal-500/30 transition-all duration-500"></div>
                    <div className="relative w-16 h-16 flex items-center justify-center 
                      bg-gradient-to-br from-teal-500 to-blue-500 rounded-full
                      group-hover:scale-110 transition-transform duration-500">
                      {IconComponent && (
                        <IconComponent className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-teal-300 to-blue-400 
                      bg-clip-text text-transparent group-hover:from-white group-hover:to-white
                      transition-colors duration-300">
                      {service.name}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-6">
                      {service.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-4 mb-8">
                      <div className="flex flex-col items-center">
                        {service.features1 && (
                          <h3 className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 flex items-start">
                            <Check className="w-5 h-5 text-teal-400 mr-2" />
                            {service.features1}
                          </h3>
                        )}
                        {service.features2 && (
                          <h3 className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 flex items-start">
                            <Check className="w-5 h-5 text-teal-400 mr-2" />
                            {service.features2}
                          </h3>
                        )}
                        {service.features3 && (
                          <h3 className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 flex items-start">
                            <Check className="w-5 h-5 text-teal-400 mr-2" />
                            {service.features3}
                          </h3>
                        )}
                      </div>
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
