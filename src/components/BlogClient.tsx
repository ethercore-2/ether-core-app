"use client";

import { useState } from "react";
import BlogSidebar from "./BlogSidebar";
import BlogList from "@/components/BlogList";
import { Blog } from "@/types/blog";
import { HeroSection } from "@/types/hero";

// ✅ Handles Filtering & Rendering
export default function BlogClient({ blogs: initialBlogs, hero }: { blogs: Blog[]; hero?: HeroSection | null }) {
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>(initialBlogs);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar with Filters */}
      <div className="w-full md:w-64 flex-shrink-0">
        <BlogSidebar setFilteredBlogs={setFilteredBlogs} />
      </div>

      {/* Blog List */}
      <div className="flex-grow">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
          {hero?.headline || "Latest Insights"}
        </h1>
        {hero?.subheadline && (
          <h2 className="text-xl text-gray-400 mb-6">
            {hero.subheadline}
          </h2>
        )}
        <BlogList blogs={filteredBlogs} />
      </div>
    </div>
  );
}
