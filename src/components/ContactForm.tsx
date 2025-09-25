"use client";

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Service {
  id: string;
  name: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General/Other Enquiries',
    message: '',
    preferred_contact_time: '',
    preferred_contact_method: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLocalhost, setIsLocalhost] = useState(false);
  // Check if running on localhost after component mounts
  useEffect(() => {
    setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  }, []);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('Attempting to fetch services from Supabase...');
        
        const { data: servicesData, error } = await supabase
          .from('services')
          .select('id, name');
        
        console.log('Supabase response:', { data: servicesData, error });
        
        if (error) {
          console.error('Supabase error fetching services:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
        }
        if (!servicesData) {
          console.warn('Supabase returned no data for services.');
        }
        setServices(servicesData || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        console.error('Error type:', typeof error);
        console.error('Error stringified:', JSON.stringify(error, null, 2));
        // Keep empty array as fallback
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject) {
      setFormData({ ...formData, subject: 'General/Other Enquiries' });
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
          preferred_contact_time: formData.preferred_contact_time,
          preferred_contact_method: formData.preferred_contact_method
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: 'General/Other Enquiries', message: '', preferred_contact_time: '', preferred_contact_method: '' });
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
        <label htmlFor="subject" className="sr-only">Subject</label>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-blue-500/20 
          rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 
          group-hover:duration-200" />
        <select
          id="subject"
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

      {/* Contact Preferences */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Preferred Contact Method */}
        <div className="relative group">
          <label htmlFor="preferred_contact_method" className="sr-only">Preferred Contact Method</label>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-blue-500/20 
            rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 
            group-hover:duration-200" />
          <select
            id="preferred_contact_method"
            name="preferred_contact_method"
            value={formData.preferred_contact_method}
            onChange={(e) => setFormData({ ...formData, preferred_contact_method: e.target.value })}
            className="relative w-full px-4 py-3 bg-[#0d2231]/50 rounded-lg 
              border border-teal-500/20 focus:border-teal-500/50
              text-gray-300 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-teal-500/20
              backdrop-blur-sm transition-all duration-300"
          >
            <option value="" className="text-gray-300 bg-[#0d2231]">Preferred Contact Method</option>
            <option value="Email" className="text-gray-300 bg-[#0d2231]">Email</option>
            <option value="Phone" className="text-gray-300 bg-[#0d2231]">Phone</option>
            <option value="WhatsApp" className="text-gray-300 bg-[#0d2231]">WhatsApp</option>
            <option value="Any" className="text-gray-300 bg-[#0d2231]">Any</option>
          </select>
        </div>

        {/* Preferred Contact Time */}
        <div className="relative group">
          <label htmlFor="preferred_contact_time" className="sr-only">Preferred Contact Time</label>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-blue-500/20 
            rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 
            group-hover:duration-200" />
          <select
            id="preferred_contact_time"
            name="preferred_contact_time"
            value={formData.preferred_contact_time}
            onChange={(e) => setFormData({ ...formData, preferred_contact_time: e.target.value })}
            className="relative w-full px-4 py-3 bg-[#0d2231]/50 rounded-lg 
              border border-teal-500/20 focus:border-teal-500/50
              text-gray-300 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-teal-500/20
              backdrop-blur-sm transition-all duration-300"
          >
            <option value="" className="text-gray-300 bg-[#0d2231]">Preferred Contact Time</option>
            <option value="Morning (9AM-12PM)" className="text-gray-300 bg-[#0d2231]">Morning (9AM-12PM)</option>
            <option value="Afternoon (12PM-5PM)" className="text-gray-300 bg-[#0d2231]">Afternoon (12PM-5PM)</option>
            <option value="Evening (5PM-8PM)" className="text-gray-300 bg-[#0d2231]">Evening (5PM-8PM)</option>
            <option value="Anytime" className="text-gray-300 bg-[#0d2231]">Anytime</option>
          </select>
        </div>
      </div>

      {/* Development notice when on localhost */}
      {isLocalhost && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-400 text-sm">
            🚀 Development Mode: All security features disabled for localhost.
          </p>
        </div>
      )}

      {/* Centered Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
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