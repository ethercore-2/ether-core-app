"use client";

import React from 'react';

const techStack = [
  { name: 'React', class: 'devicon-react-original-wordmark' },
  { name: 'Next.js', class: 'devicon-nextjs-original-wordmark' },
  { name: 'TypeScript', class: 'devicon-typescript-plain' },
  { name: 'Node.js', class: 'devicon-nodejs-plain-wordmark' },
  { name: 'Python', class: 'devicon-python-plain-wordmark' },
  { name: 'TensorFlow', class: 'devicon-tensorflow-original' },
  { name: 'AWS', class: 'devicon-amazonwebservices-plain-wordmark' },
  { name: 'Docker', class: 'devicon-docker-plain-wordmark' },
];

const TechStack: React.FC = () => {
  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-12 items-center justify-center">
          {techStack.map((tech) => (
            <div 
              key={tech.name} 
              className="flex flex-col items-center justify-center text-center group"
            >
              <div className="relative p-4">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-teal-500/0 
                  rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon */}
                <i 
                  className={`${tech.class} text-6xl md:text-7xl tech-icon opacity-70 
                    group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300`} 
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack; 