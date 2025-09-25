"use client";

import { useEffect, useRef, useState } from 'react';

export default function GridBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Lightweight visibility optimization
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 w-full h-full overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Enhanced Grid Background - Performance Optimized */}
      <div className="absolute inset-0 opacity-15">
        {/* Primary Grid Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(45, 212, 191, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(45, 212, 191, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'grid-move 25s linear infinite',
          }}
        />
        
        {/* Secondary Fine Grid */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(rgba(45, 212, 191, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(45, 212, 191, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px',
            animation: 'grid-move 35s linear infinite reverse',
          }}
        />
      </div>

                {/* Rotating Gradient Beams - Services Page Style (High Performance) */}
      {isVisible && (
        <>
          {/* Main Rotating Beam */}
          <div className="absolute inset-0 overflow-hidden opacity-40">
            <div className="absolute w-[300%] h-[300%] top-[-100%] left-[-100%] animate-slow-spin">
              <div className="absolute w-full h-32 top-1/2 left-0 bg-gradient-to-r 
                from-transparent via-teal-500/20 to-transparent blur-3xl transform -rotate-45"></div>
              <div className="absolute w-full h-16 top-1/2 left-0 bg-gradient-to-r 
                from-transparent via-blue-400/15 to-transparent blur-2xl transform rotate-45"></div>
            </div>
          </div>

          {/* Counter-Rotating Accent Beam */}
          <div className="absolute inset-0 overflow-hidden opacity-25">
            <div className="absolute w-[250%] h-[250%] top-[-75%] left-[-75%] animate-slow-spin" 
              style={{ animationDirection: 'reverse', animationDuration: '40s' }}>
              <div className="absolute w-full h-20 top-1/3 left-0 bg-gradient-to-r 
                from-transparent via-teal-300/10 to-transparent blur-2xl transform rotate-12"></div>
            </div>
          </div>

          {/* Pulsing Gradient Orbs - Pure CSS */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-radial 
              from-teal-400/20 to-transparent rounded-full animate-float-slow blur-xl"></div>
            <div className="absolute top-2/3 right-1/4 w-24 h-24 bg-gradient-radial 
              from-blue-400/15 to-transparent rounded-full animate-float-medium blur-lg" 
              style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 left-1/2 w-20 h-20 bg-gradient-radial 
              from-teal-300/18 to-transparent rounded-full animate-float-fast blur-lg"
              style={{ animationDelay: '4s' }}></div>
          </div>

          {/* Floating Light Particles */}
          <div className="absolute inset-0 opacity-70">
            <div className="absolute top-1/5 left-1/6 w-1 h-1 bg-teal-400 rounded-full animate-float-slow shadow-lg shadow-teal-400/50"></div>
            <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float-medium shadow-md shadow-blue-300/50" 
              style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-teal-300 rounded-full animate-float-fast shadow-sm shadow-teal-300/50"
              style={{ animationDelay: '3s' }}></div>
            <div className="absolute bottom-1/5 right-1/3 w-2 h-2 bg-teal-500 rounded-full animate-float-slow shadow-lg shadow-teal-500/50"
              style={{ animationDelay: '2.5s' }}></div>
            <div className="absolute top-1/2 left-4/5 w-1 h-1 bg-blue-400 rounded-full animate-float-medium shadow-sm shadow-blue-400/50"
              style={{ animationDelay: '1.5s' }}></div>
          </div>
        </>
      )}

      {/* Enhanced Depth Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d2231]/0 via-[#0d2231]/10 to-[#0d2231] z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d2231]/20 via-transparent to-[#0d2231]/20 z-10"></div>
      
      {/* Subtle Noise Texture for Premium Feel */}
      <div className="absolute inset-0 opacity-5 z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}>
      </div>
    </div>
  );
} 