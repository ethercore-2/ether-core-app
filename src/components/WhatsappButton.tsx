'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WhatsappButtonProps {
  variant?: 'navigation' | 'fixed';
  size?: number;
}

const WhatsappButton = ({ variant = 'fixed', size = 24 }: WhatsappButtonProps) => {
  const [whatsappNumber, setWhatsappNumber] = useState<string>('447700900123'); // Default fallback number (EtherCore)
  
  useEffect(() => {
    async function fetchWhatsappNumber() {
      try {
        const { data, error } = await supabase
          .from('company_info')
          .select('phone')
          .eq('is_active', true)
          .single();
        
        if (error) {
          console.error('Error fetching WhatsApp number:', error);
          return;
        }
        
        if (data && data.phone) {
          // Format the number: remove spaces and plus sign
          const formattedNumber = data.phone
            .replace(/\s+/g, '')  // Remove spaces
            .replace(/^\+/, '');  // Remove leading plus sign if present
          
          setWhatsappNumber(formattedNumber);
          console.log('WhatsApp number set to:', formattedNumber); // Debug
        }
      } catch (error) {
        console.error('Failed to fetch WhatsApp number:', error);
      }
    }

    fetchWhatsappNumber();
  }, []);

  const messageText = 'Hello! I am interested in your digital solutions and would like to know more about your services. Could you provide me with more information?';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;
  
  // Debug
  console.log('WhatsApp URL:', whatsappUrl);

  if (variant === 'navigation') {
    return (
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
        title="Contact us on WhatsApp"
      >
        <MessageCircle 
          className="text-teal-400 hover:text-teal-300 transition-colors" 
          width={size} 
          height={size} 
        />
      </a>
    );
  }

  // Fixed variant (bottom-left)
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        title="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        
        {/* Tooltip */}
        <div className="absolute left-full ml-3 bg-[#0d2231] text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat with us on WhatsApp
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-[#0d2231] rotate-45"></div>
        </div>
      </a>
    </div>
  );
};

export default WhatsappButton; 