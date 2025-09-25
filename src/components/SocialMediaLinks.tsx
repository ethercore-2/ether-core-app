import React, { JSX } from "react";
import { Instagram } from 'lucide-react';
import WhatsappButton from './WhatsappButton';


interface SocialMediaLink {
  name: string;
  url: string;
  icon: (size: number) => JSX.Element; // Function that receives size
}

const socialLinks: SocialMediaLink[] = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/ethercore_tech/',
    icon: (size) => <Instagram className={`text-teal-400 hover:text-teal-300 transition-colors`} width={size} height={size} />,
  },
];

interface SocialMediaLinksProps {
  size?: number; // Optional prop to define the icon size
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ size = 24 }) => {
  return (
    <div className="flex space-x-5 items-center">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
          aria-label={link.name}
        >
          {link.icon(size)}
        </a>
      ))}
      <WhatsappButton variant="navigation" size={size} />
    </div>
  );
};

export default SocialMediaLinks;
