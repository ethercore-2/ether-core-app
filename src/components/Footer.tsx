import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, MessageCircle, Mail, Clock } from 'lucide-react';
import SocialMediaLinks from './SocialMediaLinks';
import { getCompanyInfoWithRevalidation } from '@/lib/company-utils';
import { supabase } from '@/lib/supabase';

const Footer = async () => {
  // Fetch data from database
  const [companyInfo, { data: services }] = await Promise.all([
    getCompanyInfoWithRevalidation(),
    supabase.from('services').select('name, slug').eq('is_active', true).limit(6).order('created_at', { ascending: true })
  ]);

  // Static links
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Projects', href: '/projects' }
  ];

  const footerServices = services?.map((service: { name: string; slug?: string }) => {
    // Map services to their respective campaign pages
    const getCampaignLink = (serviceName: string) => {
      switch (serviceName.toLowerCase()) {
        case 'web development':
          return '/campaign-web';
        case 'ai automation':
          return '/campaign-automation';
        case 'seo optimization':
          return '/campaign-seo';
        case 'digital marketing':
          return '/campaign-seo';
        case 'consultation':
          return '/contact';
        default:
          return '/services';
      }
    };

    return {
      name: service.name,
      href: getCampaignLink(service.name)
    };
  }) || [
    { name: 'Web Development', href: '/campaign-web' },
    { name: 'AI Automation', href: '/campaign-automation' },
    { name: 'SEO Optimization', href: '/campaign-seo' },
    { name: 'Digital Marketing', href: '/campaign-seo' },
    { name: 'Consultation', href: '/contact' }
  ];

  const contactLinks = [
    {
      type: 'location',
      label: 'Location',
      value: 'United Kingdom'
    },
    {
      type: 'phone',
      label: 'Phone',
      value: companyInfo?.phone || '',
      href: companyInfo?.phone ? `tel:${companyInfo.phone}` : undefined
    },
    {
      type: 'whatsapp',
      label: 'WhatsApp',
      value: companyInfo?.phone || '',
      href: companyInfo?.phone ? `https://wa.me/${companyInfo.phone.replace(/[^0-9]/g, '')}` : undefined
    },
    {
      type: 'email',
      label: 'Email',
      value: companyInfo?.primary_email || 'admin@ether-core.com',
      href: `mailto:${companyInfo?.primary_email || 'admin@ether-core.com'}`
    },
    {
      type: 'hours',
      label: 'Business Hours',
      value: companyInfo?.business_hours || 'Mon-Fri 9:00-18:00'
    }
  ];

  // Contact icon mapping
  const getContactIcon = (type: string) => {
    switch (type) {
      case 'location': return <MapPin className="w-4 h-4 text-teal-400" />;
      case 'phone': return <Phone className="w-4 h-4 text-teal-400" />;
      case 'whatsapp': return <MessageCircle className="w-4 h-4 text-teal-400" />;
      case 'email': return <Mail className="w-4 h-4 text-teal-400" />;
      case 'hours': return <Clock className="w-4 h-4 text-teal-400" />;
      default: return null;
    }
  };

  return (
    <footer className="bg-[#0a0f1a] text-white">
      {/* Main Footer - Centered 4 Column Layout */}
      <div className="bg-[#0d1424] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-12 lg:gap-16">
            
            {/* Column 1: About Us */}
            <div className="w-full sm:w-auto sm:min-w-64 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-8 justify-center sm:justify-start">
                {companyInfo?.logo_figure && (
                  <Image
                    src={companyInfo.logo_figure}
                    alt={`${companyInfo.company_name} Logo`}
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                )}
                <h3 className="text-2xl font-bold text-white">
                  {companyInfo?.company_name || 'EtherCore'}
                </h3>
              </div>
              <h4 className="text-xl font-semibold text-teal-300 mb-4">
                About Us
              </h4>
              <p className="text-gray-400 leading-relaxed max-w-sm mx-auto sm:mx-0">
                {companyInfo?.description || 
                 'EtherCore offers professional digital solutions and web development services.'}
              </p>
              <div className="pt-6 flex justify-center sm:justify-start">
                <SocialMediaLinks size={40} />
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="w-full sm:w-auto text-center sm:text-left">
              <h4 className="text-xl font-semibold text-teal-300 mb-6">
                Quick Links
              </h4>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-base hover:scale-105 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Services */}
            <div className="w-full sm:w-auto text-center sm:text-left">
              <h4 className="text-xl font-semibold text-teal-300 mb-6">
                Services
              </h4>
              <ul className="space-y-4">
                {footerServices.map((service, index) => (
                  <li key={index}>
                    <Link 
                      href={service.href}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-base hover:scale-105 inline-block"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="w-full sm:w-auto text-center sm:text-left">
              <h4 className="text-xl font-semibold text-teal-300 mb-6">
                Contact
              </h4>
              <ul className="space-y-5">
                {contactLinks.map((contact, index) => (
                  <li key={index} className="flex items-start space-x-3 justify-center sm:justify-start">
                    <div className="flex-shrink-0 mt-1">
                      {getContactIcon(contact.type)}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      {contact.href ? (
                        <a
                          href={contact.href}
                          className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-base hover:scale-105 inline-block"
                          {...(contact.type === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-base">
                          {contact.value}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer - Centered Layout */}
      <div className="bg-[#0d2231] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Branding Section */}
            <div className="flex flex-col items-center space-y-3">
              <h2 className="text-2xl font-bold text-white">Ether Core</h2>
              <p className="text-gray-400">© {new Date().getFullYear()} Ether Core. All rights reserved.</p>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center">
              <SocialMediaLinks size={60} />
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <Link href="/privacy" className="text-teal-400 hover:text-teal-300 transition-colors hover:scale-105 inline-block font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-teal-400 hover:text-teal-300 transition-colors hover:scale-105 inline-block font-medium">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-teal-400 hover:text-teal-300 transition-colors hover:scale-105 inline-block font-medium">
                Cookie Policy
              </Link>
              <Link href="/contact" className="text-teal-400 hover:text-teal-300 transition-colors hover:scale-105 inline-block font-medium">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
