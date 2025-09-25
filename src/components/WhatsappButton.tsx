'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WhatsappButtonProps {
  variant?: 'navigation' | 'fixed';
  size?: number;
}

const WhatsappButton = ({ variant = 'fixed', size = 24 }: WhatsappButtonProps) => {
  const [whatsappNumber, setWhatsappNumber] = useState<string>('447700900123');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    console.log('🟢 WhatsApp Button mounted, variant:', variant);
    
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
          const formattedNumber = data.phone
            .replace(/\s+/g, '')
            .replace(/^\+/, '');
          
          setWhatsappNumber(formattedNumber);
          console.log('WhatsApp number set to:', formattedNumber);
        }
      } catch (error) {
        console.error('Failed to fetch WhatsApp number:', error);
      }
    }

    fetchWhatsappNumber();
  }, [variant]);

  const messageText = 'Hello! I am interested in your digital solutions and would like to know more about your services. Could you provide me with more information?';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;
  
  console.log('🟢 WhatsApp URL:', whatsappUrl);

  if (variant === 'navigation') {
    return (
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
        title="Contact us on WhatsApp"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle 
          className="text-teal-400 hover:text-teal-300 transition-colors" 
          width={size} 
          height={size} 
        />
      </a>
    );
  }

  // Fixed variant with beautiful aesthetics + working fixed positioning
  if (!mounted) {
    return null; // Prevent hydration mismatch for fixed positioning
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 999999,
        width: '56px',
        height: '56px',
        background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(37, 211, 102, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}

      onClick={() => {
        console.log('🟢 WhatsApp button clicked!');
        window.open(whatsappUrl, '_blank');
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) rotate(3deg)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 211, 102, 0.4), 0 8px 16px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(37, 211, 102, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)';
      }}
      title="Contact us on WhatsApp"
    >
      <MessageCircle 
        style={{ 
          width: '28px', 
          height: '28px', 
          color: 'white',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
        }} 
      />
    </div>
  );
};

export default WhatsappButton; 