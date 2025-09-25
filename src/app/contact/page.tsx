import { Metadata } from "next";
import { getHeroSectionWithRevalidation } from "@/lib/hero-utils";
import { getCompanyInfoWithRevalidation } from "@/lib/company-utils";
import { getSeoMetadataWithRevalidation, generateMetadata as generateSeoMetadata } from "@/lib/seo-utils";
import { generatePageSchema } from "@/lib/schema-utils";
import ContactForm from "@/components/ContactForm";
import GridBackground from "@/components/GridBackground";
import AboutDevs from "@/components/AboutDevs";
import { Phone, Clock, Mail, MessageSquare } from "lucide-react";

// ✅ Dynamic SEO metadata from database
export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSeoMetadataWithRevalidation('/contact');
  return generateSeoMetadata(seoData, {
    title: "Contact Us - EtherCore",
    description: "Get in touch with us today and take the first step towards transforming your online presence.",
    keywords: "contact, web development, AI automation, digital solutions, SEO optimization, business consultation",
    openGraph: {
      title: "Contact Us - EtherCore",
      description: "Get in touch with our team for professional web development, AI automation, and SEO optimization services.",
      url: "https://ether-core.com/contact",
      siteName: "EtherCore",
      images: [
        {
          url: "https://www.ether-core.com/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: "EtherCore Contact Page",
        },
      ],
    },
  });
}

// ✅ This remains a **Server Component**
export default async function ContactPage() {
  const [hero, companyInfo] = await Promise.all([
    getHeroSectionWithRevalidation('/contact'),
    getCompanyInfoWithRevalidation()
  ]);
  
  // Generate schema markup for contact page
  const schemas = generatePageSchema('contact', {
    companyInfo,
    hero
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
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <GridBackground />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-300 to-blue-400 
              bg-clip-text text-transparent animate-fade-in leading-loose pb-2 px-1">
              {hero?.headline || "Let's Build Something Amazing Together"}
            </h1>
            <h2 className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-in-up">
              {hero?.subheadline || "Ready to Transform Your Business?"}
            </h2>
            {hero?.description && (
              <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8 animate-fade-in-up">
                {hero.description}
              </p>
            )}
          </div>

          {/* Consultation Offer Card */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="relative group p-6 md:p-8 rounded-2xl overflow-hidden animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}>
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 opacity-50" />
              <div className="absolute inset-0 backdrop-blur-sm bg-[#0d2231]/50" />
              
              {/* Border Gradient */}
              <div className="absolute inset-0 border border-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-2xl" />

              {/* Content */}
              <div className="relative">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <Phone className="w-6 h-6 text-teal-400" />
                  <h2 className="text-2xl font-bold text-white">Free Consultation Call</h2>
                </div>

                <div className="space-y-4 text-center mb-8">
                  <p className="text-gray-300">
                    Book a free 15-minute consultation call with our team. We&apos;ll discuss your project 
                    and show you a live demo of our CMS platform.
                  </p>
                  <div className="flex items-center justify-center space-x-6 text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-teal-400" />
                      <span>15 Minutes</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-teal-400" />
                      <span>Live Demo</span>
                    </div>
                  </div>
                </div>

                {/* Calendar Link Button */}
                <div className="flex justify-center">
                  <a 
                    href="https://calendly.com/admin-ether-core/15min" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group inline-block"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-500 
                      rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000" />
                    <button className="relative px-8 py-4 bg-[#0a0f1a] rounded-xl text-lg font-semibold 
                      overflow-hidden group-hover:bg-[#0d2231] transition-colors duration-300">
                      <span className="bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent">
                        {hero?.primary_cta_text || "Schedule Your Free Call"}
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Or Send Us a Message
              </h2>
              <p className="text-gray-400">
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>
            </div>
            <ContactForm />
          </div>

          {/* Additional Contact Info */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-400">
              <Mail className="w-5 h-5 text-teal-400" />
              <a href="mailto:admin@ether-core.com" className="hover:text-teal-400 transition-colors">
                admin@ether-core.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Developers Section */}
      <AboutDevs />
    </main>
    </>
  );
}
