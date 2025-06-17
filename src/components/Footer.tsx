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
    supabase.from('services').select('name, slug').eq('is_active', true).limit(6).order('display_order', { ascending: true })
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

  const footerServices = services?.map((service: any) => ({
    name: service.name,
    href: `/services/${service.slug || service.name.toLowerCase().replace(/\s+/g, '-')}`
  })) || [
    { name: 'Web Development', href: '/services' },
    { name: 'AI Automation', href: '/services' },
    { name: 'SEO Optimization', href: '/services' },
    { name: 'Digital Marketing', href: '/services' },
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
      {/* Main Footer - 4 Column Layout */}
      <div className="bg-[#0d1424] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: About Us */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                {companyInfo?.logo_figure && (
                  <Image
                    src={companyInfo.logo_figure}
                    alt={`${companyInfo.company_name} Logo`}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                )}
                <h3 className="text-xl font-bold text-white">
                  {companyInfo?.company_name || 'EtherCore'}
                </h3>
              </div>
              <h4 className="text-lg font-semibold text-teal-300 mb-3">
                About Us
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {companyInfo?.description || 
                 'EtherCore offers professional digital solutions and web development services.'}
              </p>
              <div className="pt-4">
                <SocialMediaLinks size={32} />
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-teal-300 mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-teal-300 mb-6">
                Services
              </h4>
              <ul className="space-y-3">
                {footerServices.map((service, index) => (
                  <li key={index}>
                    <Link 
                      href={service.href}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-teal-300 mb-6">
                Contact
              </h4>
              <ul className="space-y-4">
                {contactLinks.map((contact, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    {getContactIcon(contact.type)}
                    <div className="flex-1">
                      {contact.href ? (
                        <a
                          href={contact.href}
                          className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm"
                          {...(contact.type === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">
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

      {/* Sub-Footer - Original Layout */}
      <div className="bg-[#0d2231] py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          {/* Left Side: Branding & Socials */}
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-6">
            <div>
              <h2 className="text-lg font-bold">Ether Core</h2>
              <p className="text-sm">© {new Date().getFullYear()} Ether Core. All rights reserved.</p>
            </div>

            {/* Social Media Icons INLINE with Branding */}
            <SocialMediaLinks size={60} />
          </div>

          {/* Right Side: Links */}
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-teal-400 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-teal-400 hover:underline">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-teal-400 hover:underline">
              Cookie Policy
            </Link>
            <Link href="/contact" className="text-teal-400 hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
