import type { Metadata } from "next";
import { getLegalPage, generateLegalPageMetadata, defaultLegalContent } from "@/lib/legal-utils";
import LegalPageContent from "@/components/LegalPageContent";

// ✅ Generate dynamic metadata from database
export async function generateMetadata(): Promise<Metadata> {
  const privacyPage = await getLegalPage('privacy');
  
  if (privacyPage) {
    return generateLegalPageMetadata(privacyPage);
  }

  // Fallback metadata
  return {
    title: "Privacy Policy - EtherCore",
    description: "Learn how EtherCore collects, uses, and protects your personal information.",
    keywords: "privacy policy, data protection, user data, cookies, security",
  };
}

// ✅ Server Component that fetches data
export default async function PrivacyPolicy() {
  const privacyPage = await getLegalPage('privacy');

  // If no data from database, use fallback content
  if (!privacyPage) {
    const fallbackPage = {
      id: 'fallback',
      page_type: 'privacy' as const,
      title: defaultLegalContent.privacy.title,
      content: defaultLegalContent.privacy.content,
      last_updated: new Date().toISOString().split('T')[0],
      version: '1.0',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return <LegalPageContent legalPage={fallbackPage} />;
  }

  return <LegalPageContent legalPage={privacyPage} />;
}
