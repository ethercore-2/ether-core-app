import Link from 'next/link';
import { type PromoAutomation } from '@/lib/promo-automation-utils';

interface AutomationPromoSectionProps {
  initialData?: PromoAutomation | null;
}

export default function AutomationPromoSection({ initialData }: AutomationPromoSectionProps) {
  // Fallback data if no database data is available
  const fallbackData: PromoAutomation = {
    id: 0,
    slug: 'fallback-ai-automation-package',
    title: 'AI Business Automation Suite',
    subtitle: 'Custom AI solutions to streamline your operations and increase efficiency',
    price_amount: 799,
    price_currency: 'GBP',
    price_label: 'Starting From',
    features: [
      { icon: '🤖', order: 1, title: 'AI Chatbots', description: '24/7 customer support automation' },
      { icon: '📧', order: 2, title: 'Email Automation', description: 'Smart email marketing workflows' },
      { icon: '📊', order: 3, title: 'Data Processing', description: 'Automated data analysis & reporting' },
      { icon: '🔄', order: 4, title: 'Workflow Automation', description: 'Custom business process automation' },
      { icon: '🎯', order: 5, title: 'Lead Generation', description: 'AI-powered lead qualification' },
      { icon: '📱', order: 6, title: 'API Integration', description: 'Connect all your business tools' }
    ],
    cta_button_text: 'Schedule Automation Consultation',
    cta_button_url: 'https://calendly.com/ethercore/automation-consultation',
    additional_info: '* Custom pricing based on complexity. Includes implementation and training.',
    is_active: true,
    display_order: 1,
    background_gradient: 'from-purple-500/10 to-violet-500/10',
    price_tag_gradient: 'from-purple-300 to-violet-400',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'fallback'
  };

  const data = initialData || fallbackData;

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-30" />
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Price Tag */}
        <div className="inline-block mb-6 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full blur-xl opacity-70" />
          <div className="relative px-8 py-3 bg-[#0d2231]/50 backdrop-blur-sm rounded-full border border-purple-500/20">
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 to-violet-400 bg-clip-text text-transparent">
              {data.price_currency === 'GBP' ? '£' : '$'}{data.price_amount} {data.price_label}
            </span>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
          {data.title}
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-3xl mx-auto">
          {data.subtitle}
        </p>

        {/* Features Grid - 2 rows x 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
          {data.features.map((feature: { icon: string; order: number; title: string; description: string }, index: number) => (
            <div 
              key={index}
              className="flex flex-col items-center p-6 rounded-xl bg-[#0d2231]/50 backdrop-blur-sm
                border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300
                hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 text-center"
            >
              <span className="text-3xl mb-3">{feature.icon}</span>
              <div className="text-center">
                <h3 className="font-semibold text-purple-300 text-base mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="relative group inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-violet-500 
            rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 
            group-hover:duration-200"></div>
          <Link 
            href={data.cta_button_url}
            target="_blank"
            className="relative inline-flex items-center px-6 py-3 bg-[#0a0f1a] rounded-xl
              text-base font-semibold overflow-hidden button-shine group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-500/20 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center space-x-2">
              <span className="bg-gradient-to-r from-purple-300 to-violet-400 bg-clip-text text-transparent 
                group-hover:from-white group-hover:to-white transition-all duration-300">
                {data.cta_button_text}
              </span>
              <svg 
                className="w-4 h-4 text-purple-400 group-hover:text-white transform group-hover:translate-x-1 
                  transition-all duration-300"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Additional Info */}
        {data.additional_info && (
          <p className="mt-4 text-gray-400 text-xs">
            {data.additional_info}
          </p>
        )}
      </div>
    </section>
  );
} 