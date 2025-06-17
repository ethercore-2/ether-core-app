'use client';

import { useState, useEffect, FormEvent } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReCAPTCHA from 'react-google-recaptcha';

// EtherCore services - fetched dynamically but with fallbacks
const defaultServices = [
  'General Inquiry',
  'Web Development',
  'AI Automation',
  'SEO Optimization',
  'UX/UI Design',
  'Digital Marketing',
  'Technical Consulting',
  'Custom Solutions'
];

const PopupContact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [services, setServices] = useState(defaultServices);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    gdpr: false,
    service: 'General Inquiry'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data: servicesData } = await supabase
          .from('services')
          .select('name')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (servicesData && servicesData.length > 0) {
          const serviceNames = ['General Inquiry', ...servicesData.map(s => s.name)];
          setServices(serviceNames);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Keep default services if fetch fails
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    // Auto show popup after 10 seconds (less aggressive than 5 seconds)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);
    
    // Listen for clicks on elements with the 'open-popup-contact' class
    const handleExternalTrigger = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const triggerElement = target.closest('.open-popup-contact');
      
      if (triggerElement) {
        e.preventDefault();
        e.stopPropagation();
        setIsVisible(true);
        setIsMinimized(false);
      }
    };
    
    document.addEventListener('click', handleExternalTrigger, true);

    const setupContactLinks = () => {
      const contactLinks = document.querySelectorAll('.open-popup-contact');
      contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          setIsVisible(true);
          setIsMinimized(false);
        });
      });
    };

    setupContactLinks();
    const observer = new MutationObserver(setupContactLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleExternalTrigger, true);
      observer.disconnect();
    };
  }, []);

  const handleToggle = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleShow = () => {
    setIsVisible(true);
    setIsMinimized(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      // Verify reCAPTCHA first
      if (!captchaValue) {
        throw new Error('Please complete the reCAPTCHA verification.');
      }

      console.log('Starting form submission...');

      // Send via API endpoint (which handles both database saving and email notification)
      const apiResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.service,
          message: `${formData.message}${formData.phone ? `\n\nPhone: ${formData.phone}` : ''}\n\n--- Submitted via Popup Form ---`,
          captchaValue: captchaValue
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully! We\'ll get back to you within 24 hours.'
      });
      
      // Reset form and minimize
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        gdpr: false,
        service: 'General Inquiry'
      });
      setCaptchaValue(null);
      
      setIsMinimized(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error sending message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) {
    return (
      <div 
        className="fixed bottom-6 right-6 z-50 cursor-pointer group"
        onClick={handleShow}
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
          <div className="relative w-14 h-14 bg-[#0a0f1a] rounded-full flex items-center justify-center border border-teal-500/30 hover:border-teal-500/60 transition-all duration-300">
            <MessageCircle className="w-6 h-6 text-teal-400" />
          </div>
        </div>
        <div className="absolute -top-12 right-0 bg-[#0d2231] text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Contact Us
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-80 bg-[#0d2231] rounded-xl shadow-2xl border border-teal-500/20 ${isMinimized ? 'h-14' : 'max-h-[90vh] overflow-y-auto'} transition-all duration-300`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer border-b border-teal-500/20"
        onClick={handleToggle}
      >
        <h3 className="text-lg font-semibold text-white">Contact EtherCore</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div className="p-4">
          {submitStatus.type && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              submitStatus.type === 'success' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              name="name"
              placeholder="Full Name" 
              value={formData.name}
              onChange={handleChange}
              required 
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-[#0a0f1a] border border-teal-500/30 rounded-lg text-white placeholder-gray-400 focus:border-teal-500/60 focus:outline-none transition-colors"
            />
            
            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              required 
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-[#0a0f1a] border border-teal-500/30 rounded-lg text-white placeholder-gray-400 focus:border-teal-500/60 focus:outline-none transition-colors"
            />
            
            <input 
              type="tel" 
              name="phone"
              placeholder="Phone Number (Optional)" 
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-[#0a0f1a] border border-teal-500/30 rounded-lg text-white placeholder-gray-400 focus:border-teal-500/60 focus:outline-none transition-colors"
            />
            
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-[#0a0f1a] border border-teal-500/30 rounded-lg text-white focus:border-teal-500/60 focus:outline-none transition-colors"
            >
              {services.map(service => (
                <option key={service} value={service} className="bg-[#0d2231]">
                  {service}
                </option>
              ))}
            </select>
            
            <textarea 
              name="message"
              placeholder="How can we help you?" 
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              rows={3}
              className="w-full px-3 py-2 bg-[#0a0f1a] border border-teal-500/30 rounded-lg text-white placeholder-gray-400 focus:border-teal-500/60 focus:outline-none transition-colors resize-none"
            />
            
            <div className="flex items-start space-x-2">
              <input 
                type="checkbox" 
                id="popup-gdpr" 
                name="gdpr"
                checked={formData.gdpr}
                onChange={handleChange}
                required 
                disabled={isSubmitting}
                className="mt-1 w-4 h-4 text-teal-500 bg-[#0a0f1a] border border-teal-500/30 rounded focus:ring-teal-500/50"
              />
              <label htmlFor="popup-gdpr" className="text-sm text-gray-300">
                I accept the <a href="/privacy" className="text-teal-400 hover:underline">privacy policy</a> and consent to data processing.
              </label>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                onChange={(value: string | null) => setCaptchaValue(value)}
                theme="dark"
                size="compact"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting || !formData.gdpr || !captchaValue}
              className="w-full py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            
            {/* reCAPTCHA Notice */}
            <div className="text-xs text-gray-500 text-center">
              Protected by reCAPTCHA
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PopupContact; 