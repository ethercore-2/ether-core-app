"use client";

import Image from 'next/image';

interface BlogImageProps {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
}

const BlogImage = ({ 
  src, 
  alt, 
  title, 
  caption, 
  width,
  height,
  className = "" 
}: BlogImageProps) => {
  // Detect if the image is an SVG
  const isSVG = src.toLowerCase().endsWith('.svg') || src.includes('.svg');
  
  return (
    <figure className={`my-8 ${className}`}>
      {/* Image Container with Auto-Thumbnails via Next.js */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900/50">
        {isSVG ? (
          // SVG Handling - Use regular img tag for better SVG support
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || "Blog Image"}
            title={title || alt}
            className="object-contain w-full h-full"
            loading="lazy"
            style={{
              width: width || '100%',
              height: height || 'auto',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          />
        ) : (
          // Raster Image Handling - Full Next.js optimization
          <Image
            src={src}
            alt={alt || "Blog Image"}
            title={title || alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 800px, 1200px"
            className="object-cover"
            quality={85}
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        )}
      </div>
      
      {/* Caption (if provided) */}
      {caption && (
        <figcaption className="mt-4 text-sm text-gray-400 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default BlogImage;
