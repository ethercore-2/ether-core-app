"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import GridBackground
const GridBackground = dynamic(() => import('@/components/GridBackground'), {
  loading: () => <div className="absolute inset-0 bg-gray-900/50 animate-pulse" />,
});

// Dynamically import ContactForm
const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  loading: () => <div className="h-64 bg-gray-800/50 animate-pulse rounded-lg" />,
});

interface PageClientComponentsProps {
  componentType: 'GridBackground' | 'ContactForm';
}

const PageClientComponents: React.FC<PageClientComponentsProps> = ({
  componentType,
}) => {
  if (componentType === 'GridBackground') {
    return <GridBackground />;
  }
  if (componentType === 'ContactForm') {
    return <ContactForm />;
  }
  return null; // Or some default/error state
};

export default PageClientComponents;
