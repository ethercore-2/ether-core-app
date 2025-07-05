"use client";

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';

// Dynamically import reCAPTCHA only when needed
const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-20 bg-[#0d2231]/30 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-gray-400 text-sm">Loading security verification...</span>
    </div>
  )
});

interface Service {
  id: string;
  name: string;
  is_active: boolean;
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General/Other Enquiries',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [showCaptcha, setShowCaptcha] = useState(false);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data: servicesData } = await supabase
          .from('services')
          .select('id, name, is_active')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        
        setServices(servicesData || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Keep empty array as fallback
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // Show captcha only when form starts being filled
  useEffect(() => {
    if (formData.name || formData.email || formData.message) {
      setShowCaptcha(true);
    }
  }, [formData.name, formData.email, formData.message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject) {
      setFormData({ ...formData, subject: 'General/Other Enquiries' });
    }
    
    // Only require captcha if reCAPTCHA is configured
    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !captchaValue) {
      alert('Please complete the reCAPTCHA.');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          captchaValue
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: 'General/Other Enquiries', message: '' });
      setCaptchaValue(null);
      setShowCaptcha(false);
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Name Input */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-blue-500/20 
            rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 
            group-hover:duration-200" />
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="relative w-full px-4 py-3 bg-[#0d2231]/50 rounded-lg 
              border border-teal-500/20 focus:border-teal-500/50
              text-gray-300 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-teal-500/20
              backdrop-blur-sm transition-all duration-300"
            placeholder="Your Name"
          />
        </div>

        {/* Email Input */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-blue-500/20 
            rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 
            group-hover:duration-200" />
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="relative w-full px-4 py-3 bg-[#0d2231]/50 rounded-lg 
              border border-teal-500/20 focus:border-teal-500/50
              text-gray-300 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-teal-500/20
              backdrop-blur-sm transition-all duration-300"
            placeholder="Your Email"
          />
        </div>
      </div>

      {/* Subject Dropdown */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-blue-500/20 
          rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 
          group-hover:duration-200" />
        <select
          name="subject"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          disabled={isLoadingServices}
          className="relative w-full px-4 py-3 bg-[#0d2231]/50 rounded-lg 
            border border-teal-500/20 focus:border-teal-500/50
            text-gray-300 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-teal-500/20
            backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
        >
          <option value="General/Other Enquiries" className="text-gray-300 bg-[#0d2231]">
            General/Other Enquiries
          </option>
          {services.length > 0 ? (
            services.map((service) => (
              <option 
                key={service.id} 
                value={service.name} 
                className="text-gray-300 bg-[#0d2231]"
              >
                {service.name}
              </option>
            ))
          ) : (
            // Fallback options if services don't load
            <>
              <option value="Web Development" className="text-gray-300 bg-[#0d2231]">Web Development</option>
              <option value="AI Automation" className="text-gray-300 bg-[#0d2231]">AI Automation</option>
              <option value="SEO Optimization" className="text-gray-300 bg-[#0d2231]">SEO Optimization</option>
              <option value="UX/UI Design" className="text-gray-300 bg-[#0d2231]">UX/UI Design</option>
              <option value="App Development" className="text-gray-300 bg-[#0d2231]">App Development</option>
            </>
          )}
        </select>
      </div>

      {/* Message Input */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-blue-500/20 
          rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 
          group-hover:duration-200" />
        <textarea
          name="message"
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={6}
          className="relative w-full px-4 py-3 bg-[#0d2231]/50 rounded-lg 
            border border-teal-500/20 focus:border-teal-500/50
            text-gray-300 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-teal-500/20
            backdrop-blur-sm transition-all duration-300 resize-none"
          placeholder="Your Message"
        />
      </div>

      {/* reCAPTCHA - Only load when needed and sitekey is available */}
      {showCaptcha && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <div className="transition-all duration-300">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={(value: string | null) => setCaptchaValue(value)}
          />
        </div>
      )}
      
      {/* Development notice when reCAPTCHA is not configured */}
      {showCaptcha && !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400 text-sm">
            ⚠️ reCAPTCHA not configured for development. Form will work without verification.
          </p>
        </div>
      )}

      {/* Centered Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting || (!showCaptcha && !!(formData.name || formData.email || formData.message))}
          className="relative inline-flex items-center px-8 py-4 bg-[#0a0f1a] rounded-xl
            text-lg font-semibold overflow-hidden button-shine group/btn disabled:opacity-50"
        >
          <span className="bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent 
            group-hover:from-white group-hover:to-white transition-all duration-300">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </span>
          <Send className="w-5 h-5 text-teal-400 group-hover:text-white ml-2" />
        </button>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="text-green-400 mt-4 text-center">Message sent successfully!</div>
      )}
      {submitStatus === 'error' && (
        <div className="text-red-400 mt-4 text-center">Failed to send message. Please try again.</div>
      )}
    </form>
  );
} 