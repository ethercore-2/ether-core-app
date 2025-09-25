"use client";

import React from 'react';
import { 
  FaReact, 
  FaNodeJs, 
  FaPython, 
  FaAws, 
  FaDocker 
} from 'react-icons/fa';
import { 
  SiNextdotjs, 
  SiTypescript, 
  SiTensorflow 
} from 'react-icons/si';

const techStack = [
  { name: 'React', icon: FaReact },
  { name: 'Next.js', icon: SiNextdotjs },
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'Node.js', icon: FaNodeJs },
  { name: 'Python', icon: FaPython },
  { name: 'TensorFlow', icon: SiTensorflow },
  { name: 'AWS', icon: FaAws },
  { name: 'Docker', icon: FaDocker },
];

const TechStack: React.FC = () => {
  return (
    <div className="px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 md:gap-12 items-center justify-center">
          {techStack.map((tech) => {
            const IconComponent = tech.icon;
            return (
              <div 
                key={tech.name} 
                className="flex flex-col items-center justify-center text-center group"
              >
                <div className="relative p-4">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-teal-500/0 
                    rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon */}
                  <IconComponent 
                    className="w-16 h-16 md:w-20 md:h-20 opacity-70 group-hover:opacity-100 
                      transform group-hover:scale-110 transition-all duration-300 text-gray-400 
                      group-hover:text-teal-400"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TechStack; 