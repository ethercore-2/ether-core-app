'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import ContactForm from './ContactForm';

const PopupContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [mounted, setMounted] = useState(false);

  console.log('🔵 PopupContact mounted, isOpen:', isOpen);

  // Initialize mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-open functionality
  useEffect(() => {
    if (hasAutoOpened) return;

    let timeoutId: NodeJS.Timeout | null = null;
    let scrollTriggered = false;

    // Function to open popup
    const openPopup = () => {
      if (!hasAutoOpened && !isOpen) {
        console.log('🔵 Auto-opening popup');
        setIsOpen(true);
        setHasAutoOpened(true);
      }
    };

    // Time-based trigger (after 30 seconds)
    timeoutId = setTimeout(() => {
      if (!scrollTriggered) {
        openPopup();
      }
    }, 30000);

    // Scroll-based trigger (after scrolling 50% of page height)
    const handleScroll = () => {
      if (scrollTriggered || hasAutoOpened) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Trigger when user scrolls 50% of the page
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
      
      if (scrollPercentage > 0.5) {
        scrollTriggered = true;
        if (timeoutId) clearTimeout(timeoutId);
        openPopup();
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasAutoOpened, isOpen]);

  // Handle manual trigger via hash or button clicks
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#popup-contact') {
        console.log('🔵 Hash trigger detected');
        setIsOpen(true);
        // Remove hash from URL without page reload
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    // Handle custom openPopup event
    const handleOpenPopup = () => {
      console.log('🔵 Custom openPopup event detected');
      setIsOpen(true);
    };

    // Handle custom triggerPopup event
    const handleTriggerPopup = (e: CustomEvent) => {
      console.log('🔵 triggerPopup event detected from:', e.detail?.source);
      setIsOpen(true);
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Listen for custom openPopup event
    window.addEventListener('openPopup', handleOpenPopup);

    // Listen for new triggerPopup event
    window.addEventListener('triggerPopup', handleTriggerPopup as EventListener);

    // Listen for click events on trigger buttons
    const handleTriggerClick = (e: Event) => {
      const target = e.target as HTMLElement;
      console.log('🔵 Click detected on:', target.tagName, target.className);
      
      // Check if clicked element or any parent has the trigger
      const triggerElement = target.closest('.open-popup-contact') || target.closest('a[href="#popup-contact"]');
      
      if (triggerElement) {
        e.preventDefault();
        console.log('🔵 Popup trigger found!', triggerElement);
        setIsOpen(true);
      } else {
        console.log('🔵 No popup trigger found');
      }
    };

    document.addEventListener('click', handleTriggerClick);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('openPopup', handleOpenPopup);
      window.removeEventListener('triggerPopup', handleTriggerPopup as EventListener);
      document.removeEventListener('click', handleTriggerClick);
    };
  }, []);

  return (
    <>
      {/* Only render after mounting to prevent hydration mismatch */}
      {mounted && (
        <>
          {/* Fixed Contact Button with beautiful aesthetics + working fixed positioning */}
          <div 
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 999999,
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(45, 212, 191, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}

            onClick={() => {
              console.log('🔵 Contact button clicked!');
              setIsOpen(true);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1) rotate(-3deg)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(45, 212, 191, 0.4), 0 8px 16px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(45, 212, 191, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
            title="Contact us"
          >
            <MessageSquare 
              style={{ 
                width: '28px', 
                height: '28px', 
                color: 'white',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
              }} 
            />
          </div>

          {/* Popup Modal */}
          {isOpen && (
            <div 
              style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999999,
                padding: '16px'
              }}
            >
              <div 
                style={{
                  backgroundColor: '#0d2231',
                  borderRadius: '12px',
                  padding: '24px',
                  width: '100%',
                  maxWidth: '640px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  position: 'relative'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    console.log('🔵 Close button clicked!');
                    setIsOpen(false);
                  }}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '24px'
                  }}
                >
                  <X style={{ width: '24px', height: '24px' }} />
                </button>

                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                    Get In Touch
                  </h2>
                  <p style={{ color: '#9ca3af' }}>
                    Ready to transform your business? Let&apos;s discuss your project.
                  </p>
                </div>

                {/* Contact Form */}
                <ContactForm />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PopupContact; 