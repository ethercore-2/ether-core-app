import React from 'react';

interface Testimonial {
  id: string;
  client_name: string;
  testimonial: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  title?: string;
  className?: string;
}

export default function Testimonials({ testimonials, title = "WHAT OUR CLIENTS SAY", className = "" }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Generate structured data for testimonials
  const testimonialsStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": title,
    "description": "Customer testimonials and reviews for EtherCore digital solutions",
    "numberOfItems": testimonials.length,
    "itemListElement": testimonials.map((testimonial, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": testimonial.rating,
          "bestRating": 5
        },
        "author": {
          "@type": "Person",
          "name": testimonial.client_name
        },
        "reviewBody": testimonial.testimonial,
        "itemReviewed": {
          "@type": "Organization",
          "name": "EtherCore",
          "description": "Professional web development and digital solutions"
        }
      }
    }))
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(testimonialsStructuredData, null, 0)
        }}
      />
      
      <section 
        className={`py-20 px-4 ${className}`}
        aria-labelledby="testimonials-heading"
        role="region"
      >
        <div className="max-w-6xl mx-auto">
          <h2 
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r 
              from-teal-300 to-blue-400 bg-clip-text text-transparent"
          >
            {title}
          </h2>
          <div 
            className="flex flex-wrap justify-center gap-8"
            role="list"
            aria-label="Customer testimonials"
          >
            {testimonials.map((testimonial) => (
              <article 
                key={testimonial.id}
                className="group relative w-full max-w-sm sm:max-w-80 p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#0d2231]/80 to-[#1a2438]/80 
                  backdrop-blur-sm hover:from-teal-600/10 hover:to-blue-600/10 
                  transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/20
                  border border-teal-500/5 hover:border-teal-500/20 hover:scale-105 text-center"
                role="listitem"
                itemScope
                itemType="https://schema.org/Review"
              >
                {/* Quote Icon */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg 
                    className="w-6 h-6 sm:w-8 sm:h-8 text-teal-400" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Rating Stars */}
                <div 
                  className="flex items-center justify-center mb-4 relative"
                  role="img"
                  aria-label={`${testimonial.rating} out of 5 stars`}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 transform group-hover:scale-110 transition-transform duration-300"
                      style={{ transitionDelay: `${i * 50}ms` }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <meta itemProp="reviewRating" content={testimonial.rating.toString()} />
                </div>

                {/* Testimonial Text */}
                <blockquote 
                  className="text-gray-300 italic mb-4 sm:mb-6 relative z-10 group-hover:text-gray-200 transition-colors text-center text-sm sm:text-base"
                  itemProp="reviewBody"
                >
                  &quot;{testimonial.testimonial}&quot;
                </blockquote>

                {/* Client Name */}
                <footer className="flex flex-col items-center">
                  <div 
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 
                      flex items-center justify-center text-white font-semibold text-base sm:text-lg
                      group-hover:scale-110 transition-transform duration-300 mb-2 sm:mb-3"
                    aria-hidden="true"
                  >
                    {testimonial.client_name.charAt(0)}
                  </div>
                  <cite 
                    className="font-semibold bg-gradient-to-r from-teal-400 to-blue-400 
                      bg-clip-text text-transparent group-hover:from-teal-300 group-hover:to-blue-300 text-center text-sm sm:text-base not-italic"
                    itemProp="author"
                  >
                    <span itemProp="name">{testimonial.client_name}</span>
                  </cite>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 