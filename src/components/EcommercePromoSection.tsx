import Link from 'next/link';
import { type PromoWeb } from '@/lib/promo-utils';

interface EcommercePromoSectionProps {
  initialData?: PromoWeb | null;
}

export default function EcommercePromoSection({ initialData }: EcommercePromoSectionProps) {
  // Fallback data if no database data is available
  const fallbackData: PromoWeb = {
    id: 0,
    slug: 'fallback-ecommerce-package',
    title: 'E-Commerce Solution',
    subtitle: 'Complete online store with payment integration',
    price_amount: 800,
    price_currency: 'GBP',
    price_label: 'Starting From',
    features: [
      { icon: '🛒', order: 1, title: 'Shopping Cart', description: 'Full e-commerce functionality' },
      { icon: '💳', order: 2, title: 'Payment Gateway', description: 'Secure payment processing' },
      { icon: '📊', order: 3, title: 'Analytics', description: 'Sales and visitor tracking' },
      { icon: '📦', order: 4, title: 'Inventory', description: 'Product management system' },
      { icon: '🚚', order: 5, title: 'Shipping', description: 'Delivery integration' },
      { icon: '📱', order: 6, title: 'Mobile Ready', description: 'Optimized for mobile shopping' }
    ],
    cta_button_text: 'Get Quote',
    cta_button_url: '/contact#consultation',
    additional_info: '* Includes product catalog, payment gateway, and inventory management.',
    is_active: true,
    display_order: 2,
    background_gradient: 'from-sky-500/10 to-cyan-500/10',
    price_tag_gradient: 'from-sky-300 to-cyan-400',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'fallback'
  };

  const data = initialData || fallbackData;

  return (
    <section className="py-16 px-4 relative overflow-hidden" role="region" aria-labelledby="ecommerce-services-heading">
      {/* Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 opacity-30" />
      </div>
      
      <article className="max-w-5xl mx-auto text-center relative z-10">
        {/* Price Tag */}
        <div className="inline-block mb-6 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 rounded-full blur-xl opacity-70" />
          <div className="relative px-8 py-3 bg-[#0d2231]/50 backdrop-blur-sm rounded-full border border-sky-500/20">
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-300 to-cyan-400 bg-clip-text text-transparent">
              {data.price_currency === 'GBP' ? '£' : '$'}{data.price_amount} {data.price_label}
            </span>
          </div>
        </div>

        <header>
          <h3 id="ecommerce-services-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            {data.title}
          </h3>
          <p className="text-gray-400 text-lg mb-10 max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </header>

        {/* Features Grid - 2 rows x 3 columns */}
        <section aria-labelledby="ecommerce-features-heading" className="mb-10">
          <h4 id="ecommerce-features-heading" className="sr-only">E-Commerce Service Features</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {data.features.map((feature: { icon: string; order: number; title: string; description: string }, index: number) => (
              <div 
                key={index}
                className="flex flex-col items-center p-6 rounded-xl bg-[#0d2231]/50 backdrop-blur-sm
                  border border-sky-500/10 hover:border-sky-500/30 transition-all duration-300
                  hover:scale-105 hover:shadow-lg hover:shadow-sky-500/20 text-center"
                role="article"
                aria-labelledby={`feature-${index}-title`}
              >
                <span className="text-3xl mb-3" role="img" aria-label={feature.title}>{feature.icon}</span>
                <div className="text-center">
                  <h5 id={`feature-${index}-title`} className="font-semibold text-sky-300 text-base mb-2">{feature.title}</h5>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Button */}
        <div className="relative group inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-cyan-500 
            rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 
            group-hover:duration-200"></div>
          <Link 
            href={data.cta_button_url}
            className="relative inline-flex items-center px-6 py-3 bg-[#0a0f1a] rounded-xl
              text-base font-semibold overflow-hidden button-shine group"
            aria-label={`${data.cta_button_text} - E-commerce solution inquiry`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-cyan-500/20 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center space-x-2">
              <span className="bg-gradient-to-r from-sky-300 to-cyan-400 bg-clip-text text-transparent 
                group-hover:from-white group-hover:to-white transition-all duration-300">
                {data.cta_button_text}
              </span>
              <svg 
                className="w-4 h-4 text-sky-400 group-hover:text-white transform group-hover:translate-x-1 
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

        {/* Additional Info */}
        {data.additional_info && (
          <footer className="mt-4">
            <p className="text-gray-400 text-xs">
              {data.additional_info}
            </p>
          </footer>
        )}
      </article>
    </section>
  );
} 