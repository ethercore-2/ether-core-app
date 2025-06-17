import type { Metadata } from "next";
import { getLegalPage, generateLegalPageMetadata, defaultLegalContent } from "@/lib/legal-utils";
import LegalPageContent from "@/components/LegalPageContent";

// ✅ Generate dynamic metadata from database
export async function generateMetadata(): Promise<Metadata> {
  const cookiesPage = await getLegalPage('cookies');
  
  if (cookiesPage) {
    return generateLegalPageMetadata(cookiesPage);
  }

  // Fallback metadata
  return {
    title: "Cookie Policy - EtherCore",
    description: "Learn about our cookie policy and how we use cookies to enhance your experience on our website.",
    keywords: "cookie policy, website cookies, tracking, privacy, cookie management, EtherCore",
  };
}

// ✅ Server Component that fetches data
export default async function CookiePolicy() {
  const cookiesPage = await getLegalPage('cookies');

  // If no data from database, use fallback content
  if (!cookiesPage) {
    const fallbackPage = {
      id: 'fallback',
      page_type: 'cookies' as const,
      title: defaultLegalContent.cookies.title,
      content: defaultLegalContent.cookies.content,
      last_updated: new Date().toISOString().split('T')[0],
      version: '1.0',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return <LegalPageContent legalPage={fallbackPage} />;
  }

  return <LegalPageContent legalPage={cookiesPage} />;
}
