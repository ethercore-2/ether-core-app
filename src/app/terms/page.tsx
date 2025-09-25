import type { Metadata } from "next";
import { getLegalPage, generateLegalPageMetadata, defaultLegalContent } from "@/lib/legal-utils";
import LegalPageContent from "@/components/LegalPageContent";

// ✅ Generate dynamic metadata from database
export async function generateMetadata(): Promise<Metadata> {
  const termsPage = await getLegalPage('terms');
  
  if (termsPage) {
    return generateLegalPageMetadata(termsPage);
  }

  // Fallback metadata
  return {
    title: "Terms of Service - EtherCore",
    description: "Read the terms of service for using EtherCore's website and services.",
    keywords: "terms of service, legal agreement, website terms, user policy, EtherCore",
  };
}

// ✅ Server Component that fetches data
export default async function TermsOfService() {
  const termsPage = await getLegalPage('terms');

  // If no data from database, use fallback content
  if (!termsPage) {
    const fallbackPage = {
      id: 'fallback',
      page_type: 'terms' as const,
      title: defaultLegalContent.terms.title,
      content: defaultLegalContent.terms.content,
      last_updated: new Date().toISOString().split('T')[0],
      version: '1.0',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return <LegalPageContent legalPage={fallbackPage} />;
  }

  return <LegalPageContent legalPage={termsPage} />;
}
