import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { getHeroSectionWithRevalidation } from "@/lib/hero-utils";
import { getCompanyInfoWithRevalidation } from "@/lib/company-utils";
import { getSeoMetadataWithRevalidation, generateMetadata as generateSeoMetadata } from "@/lib/seo-utils";
import { generatePageSchema } from "@/lib/schema-utils";
import Image from "next/image";
import { Code2, ExternalLink, Github } from "lucide-react";
import GridBackground from "@/components/GridBackground";
import Link from "next/link";
import AutomationGallery from "@/components/AutomationGallery";

// Force fresh data on every request and disable static optimization
export const revalidate = 0;
export const dynamic = 'force-dynamic';

// ✅ Dynamic SEO metadata from database
export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSeoMetadataWithRevalidation('/projects');
  return generateSeoMetadata(seoData, {
    title: "Our Projects - EtherCore",
    description: "Explore our portfolio of web development and AI automation projects.",
    keywords: "web development, AI automation, projects, portfolio, technology solutions",
    openGraph: {
      title: "Our Projects - EtherCore",
      description: "Explore our portfolio of web development and AI automation projects.",
      url: "https://ether-core.com/projects",
      siteName: "EtherCore",
      images: [
        {
          url: "https://www.ether-core.com/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: "EtherCore Projects",
        },
      ],
    },
  });
}

// ✅ Fetch function (runs on server)
async function getData() {
  const [{ data: projects }, hero, companyInfo] = await Promise.all([
    supabase.from("portfolio").select("*").order("created_at", { ascending: false }),
    getHeroSectionWithRevalidation('/projects'),
    getCompanyInfoWithRevalidation()
  ]);

  return { projects: projects || [], hero, companyInfo };
}

// ✅ Server Component (same as your other pages)
export default async function ProjectsPage() {
  const { projects, hero, companyInfo } = await getData();
  
  // Generate schema markup for projects page
  const schemas = generatePageSchema('projects', {
    companyInfo,
    hero,
    projects
  });

  return (
    <>
      {/* Schema Markup */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
      
      <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden min-h-[80vh] flex items-center">
        <GridBackground />

        <div className="max-w-6xl mx-auto relative z-20 w-full text-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-blue-500/20 blur-xl opacity-70" />
            <h1 className="relative text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-teal-300 to-blue-400 
              bg-clip-text text-transparent animate-fade-in leading-loose pb-2 px-1">
              {hero?.headline || "Our Latest Projects"}
            </h1>
          </div>
          <h2 className="text-xl text-center text-gray-300 max-w-3xl mx-auto animate-fade-in-up">
            {hero?.subheadline || "Excellence in Digital Solutions"}
          </h2>
          {hero?.description && (
            <p className="text-lg text-center text-gray-400 max-w-3xl mx-auto mt-4 animate-fade-in-up">
              {hero.description}
            </p>
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4 bg-[#0d1424]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="group relative rounded-xl overflow-hidden bg-[#0d2231] hover:bg-[#1a2438] 
                  transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/10
                  border border-teal-500/5 hover:border-teal-500/20"
              >
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1a]/80 to-[#0a0f1a] 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2231] to-transparent z-10" />
                  <Image
                    src={project.image_url}
                    alt={project.image_alt || `${project.title} - ${project.client_name || 'EtherCore Project'}`}
                    title={project.image_title || `${project.title} - ${project.client_name || 'EtherCore Project'}`}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    quality={85}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Project Type Tag */}
                  <div className="absolute top-4 left-4 z-20 transform -translate-y-2 opacity-0 
                    group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="px-3 py-1 bg-teal-500/20 backdrop-blur-sm rounded-full 
                      border border-teal-400/20 flex items-center space-x-1">
                      <Code2 className="w-3 h-3 text-teal-400" />
                      <span className="text-xs text-teal-300">{project.category || 'Project'}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6 z-20 text-center">
                  {/* Animated Line */}
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent 
                    transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                  <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-teal-300 to-blue-400 
                    bg-clip-text text-transparent group-hover:from-white group-hover:to-white 
                    transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-6">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies?.split(",").map((tech: string, index: number) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-teal-500/10 text-teal-400 
                          border border-teal-500/20"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex flex-col items-center space-y-2">
                    {project.project_url && (
                      <Link 
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-teal-400 
                          hover:text-teal-300 transition-colors duration-300 group/link"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </Link>
                    )}
                    {project.github_url && (
                      <a 
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-teal-400 
                          hover:text-teal-300 transition-colors duration-300 group/link"
                      >
                        <Github className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Gallery Section */}
      <AutomationGallery 
        sectionTitle="Automation Solutions in Action"
        sectionSubtitle="See how we've transformed businesses with custom automation projects"
        ctaText="Discuss Your Automation Ideas"
        ctaUrl="https://calendly.com/ethercore/automation-consultation"
      />

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-teal-300 to-blue-400 
            bg-clip-text text-transparent">
            Have a Project in Mind?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Let&apos;s work together to bring your vision to life. Our team is ready to help you create something amazing.
          </p>

          <a 
            href="/contact"
            className="relative inline-flex items-center px-8 py-4 bg-[#0a0f1a] rounded-xl text-lg font-semibold 
              overflow-hidden button-shine group"
          >
            <span className="bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent 
              group-hover:from-white group-hover:to-white transition-all duration-300">
              {hero?.primary_cta_text || "Start Your Project"}
            </span>
            <ExternalLink className="w-5 h-5 text-teal-400 group-hover:text-white transform 
              group-hover:translate-x-1 transition-all duration-300" />
          </a>
        </div>
      </section>
    </main>
    </>
  );
}
