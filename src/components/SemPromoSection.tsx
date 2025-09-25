import Link from 'next/link';
import { type PromoSEM } from '@/lib/promo-sem-utils';

interface SemPromoSectionProps {
  initialData?: PromoSEM | null;
}

export default function SemPromoSection({ initialData }: SemPromoSectionProps) {
  // Fallback data if no database data is available
  const fallbackData: PromoSEM = {
    id: 0,
    slug: 'fallback-google-ads-management',
    title: 'Google Ads Campaign Management',
    subtitle: 'Professional PPC management to drive qualified leads and maximize your ROI',
    setup_price_amount: 300,
    monthly_price_amount: 400,
    price_currency: 'GBP',
    setup_price_label: 'Initial Setup',
    monthly_price_label: 'Per Month',
    benefits: [
      { icon: '📈', order: 1, title: 'Qualified Leads', description: 'Target high-intent customers ready to buy', metric: '2-5x more leads' },
      { icon: '💰', order: 2, title: 'Increased Sales', description: 'Convert clicks into paying customers', metric: 'Average 300% ROI' },
      { icon: '👀', order: 3, title: 'Brand Visibility', description: 'Dominate search results and outrank competitors', metric: '10x more impressions' }
    ],
    cta_button_text: 'Start Your Google Ads Campaign',
    cta_button_url: 'https://calendly.com/ethercore/google-ads-consultation',
    additional_info: '* Includes campaign setup, keyword research, ad creation, and ongoing optimization. Minimum 3-month commitment.',
    is_active: true,
    display_order: 1,
    background_gradient: 'from-orange-500/10 to-red-500/10',
    price_tag_gradient: 'from-orange-300 to-red-400',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'fallback'
  };

  const data = initialData || fallbackData;

  return (
    <section className="py-16 px-4 relative overflow-hidden" role="region" aria-labelledby="sem-services-heading">
      {/* Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-30" />
      </div>
      
      <article className="max-w-5xl mx-auto text-center relative z-10">
        {/* 1. Setup Price Tag */}
        <div className="inline-block mb-6 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl opacity-70" />
          <div className="relative px-8 py-3 bg-[#0d2231]/50 backdrop-blur-sm rounded-full border border-orange-500/20">
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">
              {data.price_currency === 'GBP' ? '£' : '$'}{data.setup_price_amount} {data.setup_price_label}
            </span>
          </div>
        </div>

        <header>
          {/* 2. Title */}
          <h3 id="sem-services-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            {data.title}
          </h3>
          
          {/* 3. Subtitle */}
          <p className="text-gray-400 text-lg mb-10 max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </header>

        {/* 4. Benefits Cards - 3 cards showing key benefits */}
        <section aria-labelledby="sem-benefits-heading" className="mb-10">
          <h4 id="sem-benefits-heading" className="sr-only">SEM Service Benefits</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {data.benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex flex-col items-center p-6 rounded-xl bg-[#0d2231]/50 backdrop-blur-sm
                  border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300
                  hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 text-center group"
                role="article"
                aria-labelledby={`benefit-${index}-title`}
              >
                {/* Icon */}
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" role="img" aria-label={benefit.title}>
                  {benefit.icon}
                </div>
                
                {/* Title */}
                <h5 id={`benefit-${index}-title`} className="font-semibold text-orange-300 text-lg mb-2 group-hover:text-orange-200 transition-colors">
                  {benefit.title}
                </h5>
                
                {/* Description */}
                <p className="text-gray-400 text-sm mb-3 group-hover:text-gray-300 transition-colors">
                  {benefit.description}
                </p>
                
                {/* Metric */}
                <div className="mt-auto">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 
                    rounded-full text-orange-300 text-xs font-semibold border border-orange-500/30
                    group-hover:from-orange-500/30 group-hover:to-red-500/30 transition-all duration-300">
                    {benefit.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Monthly Price */}
        <div className="mb-8">
          <div className="inline-block relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur-lg opacity-70" />
            <div className="relative px-6 py-3 bg-[#0d2231]/50 backdrop-blur-sm rounded-xl border border-orange-500/20">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg text-gray-400">Then</span>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">
                  {data.price_currency === 'GBP' ? '£' : '$'}{data.monthly_price_amount} {data.monthly_price_label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. CTA Button */}
        <div className="relative group inline-block mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-500 
            rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 
            group-hover:duration-200"></div>
          <Link 
            href={data.cta_button_url}
            target="_blank"
            className="relative inline-flex items-center px-8 py-4 bg-[#0a0f1a] rounded-xl
              text-lg font-semibold overflow-hidden button-shine group"
            aria-label={`${data.cta_button_text} - Opens in new tab`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-500/20 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center space-x-3">
              <span className="bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent 
                group-hover:from-white group-hover:to-white transition-all duration-300">
                {data.cta_button_text}
              </span>
              <svg 
                className="w-5 h-5 text-orange-400 group-hover:text-white transform group-hover:translate-x-1 
                  transition-all duration-300"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
        </div>

        {/* 7. Additional Info / Clarification */}
        {data.additional_info && (
          <footer>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
              {data.additional_info}
            </p>
          </footer>
        )}
      </article>
    </section>
  );
} 