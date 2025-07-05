"use client";

import { useEffect, useRef, useState } from 'react';

export default function GridBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Performance optimization: Use Intersection Observer to pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Throttled mouse tracking (reduced frequency)
    let mouseTimeout: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      }, 32); // ~30fps instead of constant updates
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(mouseTimeout);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 w-full h-full overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Static CSS Grid Background - Much more performant */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent"
          style={{
            backgroundImage: `
              linear-gradient(rgba(45, 212, 191, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(45, 212, 191, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'grid-move 20s linear infinite',
          }}
        />
      </div>

      {/* Animated overlay elements - Much lighter */}
      {isVisible && (
        <div className="absolute inset-0 opacity-40">
          {/* Floating orbs using CSS animations instead of canvas */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-float-slow opacity-60" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-teal-300 rounded-full animate-float-medium opacity-40" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-teal-500 rounded-full animate-float-fast opacity-50" />
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-teal-400 rounded-full animate-float-slow opacity-30" />
        </div>
      )}

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d2231]/0 via-[#0d2231]/20 to-[#0d2231] z-10" />
      
      {/* Mouse interaction effect - CSS only */}
      <div 
        className="absolute w-96 h-96 bg-gradient-radial from-teal-400/20 to-transparent rounded-full pointer-events-none transition-all duration-300 opacity-0 hover:opacity-100 blur-3xl"
        style={{
          transform: `translate(${mouseRef.current.x - 192}px, ${mouseRef.current.y - 192}px)`,
        }}
      />
    </div>
  );
} 