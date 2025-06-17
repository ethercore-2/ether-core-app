"use client";

import { useEffect, useRef } from 'react';

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio (optimized)
    const resizeCanvas = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      ctx.scale(scale, scale);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse movement (slightly throttled but responsive)
    let mouseTimeout: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouseRef.current = {
          x: e.clientX,
          y: e.clientY
        };
      }, 8); // Faster than before for better responsiveness
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Grid properties - RESTORED ORIGINAL VALUES
    const GRID_SIZE = 40; // Back to original
    let time = 0;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      life: number;
    }> = [];

    // Create floating particles - RESTORED
    const createParticle = () => {
      if (particles.length < 50) {  // Back to original count
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1, // Original size
          speedX: (Math.random() - 0.5) * 0.5, // Original speed
          speedY: (Math.random() - 0.5) * 0.5,
          life: 1
        });
      }
    };

    // RESTORED ORIGINAL ANIMATION with optimizations
    function animate() {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new particles
      if (Math.random() < 0.1) createParticle(); // Original frequency

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life -= 0.003; // Original fade rate

        if (particle.life <= 0) {
          particles.splice(index, 1);
          return;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(45, 212, 191, ${particle.life * 0.2})`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // RESTORED ORIGINAL GRID ANIMATION
      const rows = Math.ceil(canvas.height / GRID_SIZE);
      const cols = Math.ceil(canvas.width / GRID_SIZE);

      // Mouse influence radius
      const influenceRadius = 200;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = j * GRID_SIZE;
          const y = i * GRID_SIZE;

          // Calculate distance from mouse
          const dx = x - mouseRef.current.x;
          const dy = y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const mouseInfluence = Math.max(0, 1 - distance / influenceRadius);

          // Calculate base wave effect
          const baseWave = Math.sin(distance * 0.02 - time) + 
                          Math.sin(x * 0.02 + time) * 0.5 + 
                          Math.sin(y * 0.02 + time) * 0.5;

          // Combine mouse influence with base wave
          const wave = baseWave + mouseInfluence * 2;
          const size = (wave + 2) * 2;

          // Calculate alpha based on distance from center and mouse
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const distanceFromCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          );
          const maxRadius = Math.min(canvas.width, canvas.height) * 0.5;
          const baseAlpha = Math.max(0, 1 - distanceFromCenter / maxRadius);
          const alpha = baseAlpha + mouseInfluence * 0.3;

          // Draw connecting lines with mouse influence
          if (j < cols - 1) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(45, 212, 191, ${alpha * 0.15 + mouseInfluence * 0.1})`;
            ctx.lineWidth = 1 + mouseInfluence;
            ctx.moveTo(x, y);
            ctx.lineTo(x + GRID_SIZE, y);
            ctx.stroke();
          }

          if (i < rows - 1) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(45, 212, 191, ${alpha * 0.15 + mouseInfluence * 0.1})`;
            ctx.lineWidth = 1 + mouseInfluence;
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + GRID_SIZE);
            ctx.stroke();
          }

          // Draw dots with enhanced effects
          ctx.beginPath();
          ctx.fillStyle = `rgba(45, 212, 191, ${alpha * 0.5 + mouseInfluence * 0.3})`;
          ctx.arc(x, y, size * (1 + mouseInfluence), 0, Math.PI * 2);
          ctx.fill();

          // Add glow effect
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2 * (1 + mouseInfluence));
          gradient.addColorStop(0, `rgba(45, 212, 191, ${(alpha * 0.2 + mouseInfluence * 0.2)})`);
          gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');
          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(x, y, size * 2 * (1 + mouseInfluence), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      time += 0.005; // Original time increment
      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(mouseTimeout);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d2231]/0 to-[#0d2231] z-10" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: 'transparent',
          opacity: 0.6,
          mixBlendMode: 'screen',
          willChange: 'transform', // Performance hint
        }}
      />
    </div>
  );
} 