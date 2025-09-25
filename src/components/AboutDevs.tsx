import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Linkedin, Code, Brain, Sparkles } from 'lucide-react';

// Types
interface Developer {
  id: string;
  name: string;
  role: string;
  education?: string;
  bio: string;
  photo_url: string;
  skills: string[];
  linkedin_url?: string;
  github_url?: string;
  display_order: number;
  is_active: boolean;
}

// Generate structured data for team members
function generateTeamSchema(developers: Developer[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EtherCore",
    "url": "https://ether-core.com",
    "employee": developers.map(developer => ({
      "@type": "Person",
      "name": developer.name,
      "jobTitle": developer.role,
      "description": developer.bio,
      "image": developer.photo_url,
      "sameAs": [
        developer.linkedin_url
      ].filter(Boolean),
      "knowsAbout": developer.skills,
      "worksFor": {
        "@type": "Organization",
        "name": "EtherCore",
        "url": "https://ether-core.com"
      }
    }))
  };
}

// Fetch developers from database
async function getDevelopers(): Promise<Developer[]> {
  try {
    const { data, error } = await supabase
      .from('developers')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching developers:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching developers:', error);
    return [];
  }
}

// Fallback data if database is empty
const fallbackDevelopers: Developer[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    role: 'Full-Stack Developer & Co-Founder',
    education: 'B.S. Computer Science, Stanford University',
    bio: 'Passionate full-stack developer with 8+ years of experience in modern web technologies. Specializes in React, Node.js, and cloud architecture. Led development of 50+ successful projects.',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker', 'GraphQL'],
    linkedin_url: 'https://linkedin.com/in/alexthompson',
    github_url: 'https://github.com/alexthompson',
    display_order: 1,
    is_active: true
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'AI/ML Engineer & Technical Lead',
    education: 'Ph.D. Computer Science, MIT',
    bio: 'AI/ML specialist with expertise in automation, chatbots, and intelligent systems. PhD in Computer Science, 6+ years building scalable AI solutions for businesses worldwide.',
    photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b9a8c0e2?w=400&h=400&fit=crop&crop=face',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI API', 'Machine Learning', 'NLP', 'Computer Vision', 'Azure AI'],
    linkedin_url: 'https://linkedin.com/in/sarahchen',
    github_url: 'https://github.com/sarahchen',
    display_order: 2,
    is_active: true
  }
];

const AboutDevs: React.FC = async () => {
  const developers = await getDevelopers();
  const displayDevelopers = developers.length > 0 ? developers : fallbackDevelopers;

  // Generate team schema for SEO
  const teamSchema = generateTeamSchema(displayDevelopers);

  return (
    <>
      {/* Team Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(teamSchema, null, 0)
        }}
      />
      
      <section 
        className="py-16 sm:py-20 md:py-24 px-4 bg-[#0d1424] relative overflow-hidden"
        aria-labelledby="team-heading"
        role="region"
      >
        {/* Background Effects */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <header className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative" aria-hidden="true">
                <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
              </div>
              <h2 
                id="team-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent"
              >
                Meet Our Team
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              The passionate developers behind EtherCore&apos;s innovative digital solutions
            </p>
          </header>

          {/* Developers Grid */}
          <div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto"
            role="list"
            aria-label="Team members"
          >
            {displayDevelopers.map((developer, index) => (
              <article
                key={developer.id}
                className="group relative bg-gradient-to-br from-[#0d2231]/80 to-[#1a2438]/80 
                  backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-teal-500/10 
                  hover:border-teal-500/30 transition-all duration-500
                  hover:shadow-[0_0_40px_rgba(45,212,191,0.15)] hover:transform hover:scale-[1.02]"
                role="listitem"
                itemScope
                itemType="https://schema.org/Person"
              >
                {/* Background Effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-teal-600/0 via-teal-600/5 to-blue-600/0 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" 
                  aria-hidden="true"
                />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Profile Section */}
                  <div className="flex flex-col items-center gap-6 mb-8">
                    {/* Photo */}
                    <div className="relative flex-shrink-0">
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-blue-500/30 rounded-full blur-xl 
                          group-hover:from-teal-500/50 group-hover:to-blue-500/50 transition-all duration-500" 
                        aria-hidden="true"
                      />
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-teal-500/20 
                        group-hover:border-teal-500/40 transition-all duration-500">
                        <Image
                          src={developer.photo_url}
                          alt={`Professional headshot of ${developer.name}, ${developer.role} at EtherCore`}
                          title={`${developer.name} - ${developer.role}`}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          priority={index === 0}
                          quality={90}
                          sizes="(max-width: 640px) 96px, 112px"
                          loading={index === 0 ? "eager" : "lazy"}
                          itemProp="image"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center">
                      <h3 
                        className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-teal-300 to-blue-400 
                          bg-clip-text text-transparent group-hover:from-white group-hover:to-white 
                          transition-all duration-300"
                        itemProp="name"
                      >
                        {developer.name}
                      </h3>
                      <p 
                        className="text-teal-400 font-semibold mb-4 group-hover:text-teal-300 transition-colors duration-300"
                        itemProp="jobTitle"
                      >
                        {developer.role}
                      </p>
                      
                      {/* Education */}
                      {developer.education && (
                        <p 
                          className="text-blue-400 font-semibold mb-4 group-hover:text-blue-300 transition-colors duration-300"
                          itemProp="alumniOf"
                        >
                          {developer.education}
                        </p>
                      )}
                      
                      {/* Social Links */}
                      <div className="flex justify-center gap-4" role="list" aria-label={`${developer.name}&apos;s social media profiles`}>
                        {developer.linkedin_url && (
                          <Link
                            href={developer.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-gradient-to-r from-teal-500/20 to-blue-500/20 
                              hover:from-teal-500/30 hover:to-blue-500/30 text-teal-400 hover:text-white
                              transition-all duration-300 hover:scale-110"
                            aria-label={`${developer.name}&apos;s LinkedIn profile`}
                            itemProp="sameAs"
                          >
                            <Linkedin className="w-5 h-5" aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-8">
                    <p 
                      className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 
                        leading-relaxed text-center"
                      itemProp="description"
                    >
                      {developer.bio}
                    </p>
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 justify-center">
                      <Brain className="w-5 h-5 text-teal-400" aria-hidden="true" />
                      <h4 className="text-lg font-semibold text-teal-300">Technical Skills</h4>
                    </div>
                    <div 
                      className="flex flex-wrap gap-2 justify-center"
                      role="list"
                      aria-label={`${developer.name}&apos;s technical skills`}
                    >
                      {developer.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 text-sm bg-gradient-to-r from-teal-500/10 to-blue-500/10 
                            border border-teal-500/20 rounded-full text-teal-300
                            hover:from-teal-500/20 hover:to-blue-500/20 hover:border-teal-500/40
                            transition-all duration-300 hover:scale-105"
                          role="listitem"
                          itemProp="knowsAbout"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div 
                  className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  aria-hidden="true"
                >
                  <Sparkles className="w-8 h-8 text-teal-400" />
                </div>
                
                {/* Hover Border Effect */}
                <div 
                  className="absolute inset-0 border border-transparent 
                    group-hover:border-teal-500/30 rounded-2xl transition-colors duration-500 pointer-events-none" 
                  aria-hidden="true"
                />
              </article>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 sm:mt-20">
            <p className="text-gray-400 mb-6 text-lg">
              Ready to work with our expert team?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 
                text-white rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-blue-600 
                transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-teal-500/25"
              aria-label="Contact EtherCore team for consultation"
            >
              <span>Get In Touch</span>
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutDevs; 