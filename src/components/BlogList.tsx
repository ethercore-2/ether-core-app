"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

interface Blog {
  id: number;
  title: string;
  content: string;
  image_url: string;
  published_at: string;
  slug: string;
  tags: string[];
  // SEO Image fields
  image_alt?: string;
  image_title?: string;
  image_description?: string;
  image_caption?: string;
  image_width?: number;
  image_height?: number;
}

interface BlogListProps {
  blogs: Blog[];
  children?: React.ReactNode;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, children }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
      {blogs.map((blog) => (
        <motion.article 
          key={blog.id}
          variants={item}
          className="group bg-gradient-to-br from-[#0d1424] to-[#131b2e] rounded-xl overflow-hidden
            hover:shadow-2xl transition-all duration-500 hover:shadow-blue-500/10
            border border-blue-500/5 hover:border-blue-500/20"
        >
          <div className="md:flex">
            {/* Image Container */}
            <div className="md:w-1/3 relative overflow-hidden">
              <div className="aspect-[16/9] md:aspect-auto md:h-full relative group">
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                
                {/* Image */}
                <Image
                  src={blog.image_url}
                  alt={blog.image_alt || blog.title}
                  title={blog.image_title || blog.title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 400px, 300px"
                />

                {/* Displaying Blog Tags */}
                {blog.tags.length > 0 && (
                  <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <div key={tag} className="px-3 py-1 bg-blue-800/80 backdrop-blur-sm rounded-full 
                        border border-blue-400/20 flex items-center space-x-1">
                        <Tag className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-blue-300">{tag}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:w-2/3 relative">
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 
                opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              
              {/* Content Wrapper */}
              <div className="relative">
                <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 
                  bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 
                  transition-all duration-300">
                  {blog.title}
                </h2>
                
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center group/date">
                    <Calendar className="h-4 w-4 mr-1 group-hover/date:text-blue-400 transition-colors duration-300" />
                    <span className="group-hover/date:text-blue-400 transition-colors duration-300">
                      {new Date(blog.published_at).toLocaleDateString()}
                    </span>
                  </span>
                  <span className="flex items-center group/time">
                    <Clock className="h-4 w-4 mr-1 group-hover/time:text-purple-400 transition-colors duration-300" />
                    <span className="group-hover/time:text-purple-400 transition-colors duration-300">
                      5 min read
                    </span>
                  </span>
                </div>

                <p className="text-gray-300 mb-6 line-clamp-2 group-hover:text-gray-200 
                  transition-colors duration-300">
                  {blog.content}
                </p>

                <Link 
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center px-4 py-2 rounded-lg
                    bg-gradient-to-r from-blue-500/10 to-purple-500/10
                    hover:from-blue-500/20 hover:to-purple-500/20
                    text-blue-400 hover:text-blue-300 
                    transition-all duration-300 group/link"
                >
                  Read More 
                  <ArrowRight className="h-4 w-4 ml-2 transform group-hover/link:translate-x-1 
                    transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
};

export default BlogList;
