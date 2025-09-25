import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface AutomationGalleryItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  image_alt: string;
  image_title?: string;
  meta_description?: string;
  display_order: number;
  schema_data?: Record<string, unknown>;
}

interface AutomationGalleryProps {
  ctaText?: string;
  ctaUrl?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

// Server component that fetches data
async function getAutomationGalleryData(): Promise<AutomationGalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from('automation_gallery')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(3);

    if (error) {
      console.error('Error fetching automation gallery:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching automation gallery:', err);
    return [];
  }
}

const AutomationGallery = async ({ 
  ctaText = "Schedule Free Automation Consultation",
  ctaUrl = "https://calendly.com/ethercore/automation-consultation",
  sectionTitle = "Automation Solutions",
  sectionSubtitle = "Discover how AI can transform your business operations"
}: AutomationGalleryProps) => {
  const galleryItems = await getAutomationGalleryData();

  // Fallback data if database is empty
  const fallbackItems: AutomationGalleryItem[] = [
    {
      id: 1,
      title: "Blog Content Automation",
      description: "Automatically generate, optimize, and publish blog content with AI-powered writing assistants. Schedule posts, optimize for SEO, and maintain consistent publishing schedules without manual intervention.",
      image_url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&crop=center",
      image_alt: "AI blog automation dashboard showing content generation and publishing workflow",
      image_title: "Blog Content Automation - AI-Powered Content Creation",
      display_order: 1,
    },
    {
      id: 2,
      title: "Lead Generation Automation",
      description: "Capture, qualify, and nurture leads automatically with intelligent chatbots, email sequences, and CRM integration. Convert website visitors into qualified prospects 24/7 without manual effort.",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center",
      image_alt: "Lead generation automation system with chatbot interface and CRM integration dashboard",
      image_title: "Lead Generation Automation - AI-Powered Lead Capture",
      display_order: 2,
    },
    {
      id: 3,
      title: "Email Marketing Automation",
      description: "Create personalized email campaigns that trigger based on user behavior, segment audiences automatically, and optimize send times for maximum engagement and conversion rates.",
      image_url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=center",
      image_alt: "Email marketing automation platform showing campaign workflows and analytics dashboard",
      image_title: "Email Marketing Automation - Personalized Campaign Management",
      display_order: 3,
    }
  ];

  const displayItems = galleryItems.length > 0 ? galleryItems : fallbackItems;

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-[#0d1424] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a]" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-300 to-violet-400 bg-clip-text text-transparent px-2">
            {sectionTitle}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto px-4">
            {sectionSubtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {displayItems.map((item, index) => (
            <div 
              key={item.id}
              className="group relative bg-[#0d2231]/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/10 hover:border-purple-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
            >
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Image Container */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2231]/60 to-transparent z-10" />
                <Image
                  src={item.image_url}
                  alt={item.image_alt}
                  title={item.image_title || item.title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index === 0}
                  quality={85}
                />
                
                {/* Floating Icon */}
                <div className="absolute top-4 right-4 z-20 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-400/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative p-6 z-20">
                {/* Animated Line */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors duration-300">
                  {item.title}
                </h3>
                
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Schema Data Indicator (for SEO) */}
                {item.schema_data && (
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify(item.schema_data, null, 0)
                    }}
                  />
                )}
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border border-transparent group-hover:border-purple-500/20 rounded-xl transition-colors duration-500" />
            </div>
          ))}
        </div>

        {/* Single CTA Section */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-violet-500 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000"></div>
            <Link
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group inline-flex items-center px-8 py-4 bg-[#0a0f1a] rounded-2xl leading-none space-x-3 hover:bg-[#0d1117] transition-all duration-300 transform hover:scale-105"
            >
              <Calendar className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
              <span className="text-lg font-semibold text-white group-hover:text-purple-100 transition-colors duration-300">
                {ctaText}
              </span>
              <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transform group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          </div>
          
          {/* Supporting Text */}
          <p className="mt-4 text-gray-400 text-sm max-w-md mx-auto">
            Get a free 30-minute consultation to discuss your automation opportunities
          </p>
        </div>
      </div>
    </section>
  );
};

export default AutomationGallery; 