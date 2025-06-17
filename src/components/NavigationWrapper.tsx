import { getSiteContent } from '@/lib/company-utils';
import Navigation from './Navigation';

const NavigationWrapper = async () => {
  // Fetch CTA text from database
  const ctaText = await getSiteContent('nav_cta_button');
  
  return <Navigation ctaText={ctaText || 'Free Consultation'} />;
};

export default NavigationWrapper; 