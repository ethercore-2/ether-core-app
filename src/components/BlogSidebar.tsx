"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Blog } from "@/types/blog";

interface BlogSidebarProps {
  setFilteredBlogs: React.Dispatch<React.SetStateAction<Blog[]>>
}

const BlogSidebar = ({ setFilteredBlogs }: BlogSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTags() {
      const { data: blogs, error } = await supabase.from("blogs").select("tags");

      if (error) {
        console.error("Error fetching tags:", error);
        return;
      }

      // Flatten and remove duplicates
      const uniqueTags = [...new Set(blogs.flatMap((blog) => blog.tags || []))];
      setTags(uniqueTags);
    }

    fetchTags();
  }, []);

  // Fetch and filter blog posts by time period
  async function filterByTimePeriod(period: string) {
    setSelectedPeriod(period);
    setSelectedTag(null); // Reset tag filter when selecting a time period
    let startDate;

    const now = new Date();
    if (period === "Last Week") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Last 7 days
    } else if (period === "This Week") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - now.getDay()); // Start of this week
    } else if (period === "This Month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of this month
    } else {
      // Default (All Time) - Reset Filter
      const { data } = await supabase.from("blogs").select("*").order("published_at", { ascending: false });
      setFilteredBlogs(data || []);
      return;
    }

    const { data: filtered } = await supabase
      .from("blogs")
      .select("*")
      .gte("published_at", startDate.toISOString())
      .order("published_at", { ascending: false });

    setFilteredBlogs(filtered || []);
  }

  // Fetch and filter blog posts by selected tag
  async function filterByTag(tag: string) {
    setSelectedTag(tag);
    setSelectedPeriod(null); // Reset time filter when selecting a tag

    const { data: filtered } = await supabase
      .from("blogs")
      .select("*")
      .contains("tags", [tag]) // Check if the tags column contains the selected tag
      .order("published_at", { ascending: false });

    setFilteredBlogs(filtered || []);
  }

  return (
    <aside className="bg-[#0d1424] rounded-xl p-6 sticky top-24">
      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#131b2e] border border-blue-900/30 rounded-lg px-4 py-2 pl-10 
              text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500/50
              transition-colors duration-200"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
      </div>

      {/* Time Filter */}
      <div className="mb-8">
        <h3 className="flex items-center text-lg font-semibold mb-4 text-white">
          <Calendar className="h-5 w-5 mr-2 text-blue-400" />
          Time Period
        </h3>
        <div className="space-y-2">
          {["All Time", "This Month", "This Week", "Last Week"].map((period) => (
            <button
              key={period}
              onClick={() => filterByTimePeriod(period)}
              className={`w-full text-left px-3 py-2 rounded-lg 
                ${selectedPeriod === period ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-blue-500/10 hover:text-blue-400"}
                transition-colors duration-200`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Tags (Fetched from Supabase) */}
      <div>
        <h3 className="flex items-center text-lg font-semibold mb-4 text-white">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <button
                key={tag}
                onClick={() => filterByTag(tag)}
                className={`px-3 py-1 rounded-full text-sm 
                  ${selectedTag === tag ? "bg-blue-600 text-white" : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"} 
                  transition-colors duration-200`}
              >
                {tag}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No tags available.</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
