import { supabase } from './supabase';

// Legal page interface
export interface LegalPage {
  id: string;
  page_type: 'privacy' | 'terms' | 'cookies';
  title: string;
  content: string;
  last_updated: string;
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch legal page by type
export async function getLegalPage(pageType: 'privacy' | 'terms' | 'cookies'): Promise<LegalPage | null> {
  try {
    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .eq('page_type', pageType)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error(`Error fetching ${pageType} page:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Failed to fetch ${pageType} page:`, error);
    return null;
  }
}

// Fetch all active legal pages
export async function getAllLegalPages(): Promise<LegalPage[]> {
  try {
    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .eq('is_active', true)
      .order('page_type', { ascending: true });

    if (error) {
      console.error('Error fetching legal pages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch legal pages:', error);
    return [];
  }
}

// Format last updated date
export function formatLastUpdated(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

// Generate metadata for legal pages
export function generateLegalPageMetadata(legalPage: LegalPage) {
  const baseMetadata = {
    title: `${legalPage.title} - EtherCore`,
    keywords: `${legalPage.page_type} policy, legal, terms, EtherCore`,
    openGraph: {
      title: `${legalPage.title} - EtherCore`,
      url: `https://ether-core.com/${legalPage.page_type}`,
      siteName: "EtherCore",
      type: "website"
    }
  };

  // Page-specific descriptions and keywords
  switch (legalPage.page_type) {
    case 'privacy':
      return {
        ...baseMetadata,
        description: "Learn how EtherCore collects, uses, and protects your personal information. Our commitment to data privacy and security.",
        keywords: "privacy policy, data protection, user privacy, GDPR compliance, data security, EtherCore",
        openGraph: {
          ...baseMetadata.openGraph,
          description: "Learn how EtherCore collects, uses, and protects your personal information."
        }
      };
    
    case 'terms':
      return {
        ...baseMetadata,
        description: "Read EtherCore's terms of service for website usage, service agreements, and legal conditions.",
        keywords: "terms of service, website terms, service agreement, legal terms, conditions, EtherCore",
        openGraph: {
          ...baseMetadata.openGraph,
          description: "Read EtherCore's terms of service for website usage and service agreements."
        }
      };
    
    case 'cookies':
      return {
        ...baseMetadata,
        description: "Learn about EtherCore's cookie usage, types of cookies we use, and how to manage your cookie preferences.",
        keywords: "cookie policy, website cookies, tracking, privacy, cookie management, EtherCore",
        openGraph: {
          ...baseMetadata.openGraph,
          description: "Learn about EtherCore's cookie usage and how to manage your preferences."
        }
      };
    
    default:
      return baseMetadata;
  }
}

// Parse content for rendering (handles markdown-like formatting)
export function parseContent(content: string): string {
  // Basic markdown-like parsing for dynamic content
  return content
    .replace(/\n\n/g, '</p><p>') // Paragraphs
    .replace(/\n/g, '<br>') // Line breaks
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-teal-400 hover:underline">$1</a>'); // Links
}

// Default content fallbacks (in case database is empty)
export const defaultLegalContent = {
  privacy: {
    title: 'Privacy Policy',
    content: `This Privacy Policy explains how EtherCore collects, uses, and protects your personal information when you visit our website.

**Information We Collect:**
- Personal information (name, email, subject of inquiry)
- Technical information (IP address, browser type, pages visited)
- Cookies and tracking data

**How We Use Your Information:**
- Respond to inquiries
- Improve website and services
- Analyze traffic and enhance security

**Your Rights:**
You have the right to access, correct, or delete your data. Contact us at admin@ether-core.com.

**Data Security:**
We implement strict security measures to protect your data. However, no system is 100% secure.`
  },
  terms: {
    title: 'Terms of Service',
    content: `Welcome to EtherCore. By accessing our website, you agree to these Terms of Service.

**Use of Our Website:**
- You must be at least 18 years old to use this site
- You cannot use our website for unlawful activities
- We may change or suspend services without notice

**Intellectual Property:**
All content on this site (text, images, branding) is owned by EtherCore. You cannot copy, distribute, or modify any content without permission.

**Disclaimers & Limitations:**
- No guarantees: We aim to provide accurate information but do not guarantee error-free content
- Limited liability: We are not responsible for any damages resulting from website use
- External links: We may link to third-party sites but do not control their content

**Contact Us:**
📩 Contact us at admin@ether-core.com.`
  },
  cookies: {
    title: 'Cookie Policy',
    content: `This Cookie Policy explains how EtherCore uses cookies and similar technologies.

**What Are Cookies?**
Cookies are small files stored on your device that help improve your browsing experience.

**How We Use Cookies:**
- Ensure website functionality
- Analyze traffic and improve performance
- Protect against spam and security threats

**Types of Cookies We Use:**
- Essential Cookies: Needed for website functionality
- Analytics Cookies: Track user behavior and performance
- Security Cookies: Prevent spam with Google reCAPTCHA
- Third-Party Cookies: Used by services like Google, YouTube, Facebook

**Managing Cookies:**
You can disable cookies in your browser settings. Visit your browser's help section for instructions.

**Contact Us:**
If you have questions about cookies, contact us at admin@ether-core.com.`
  }
}; 