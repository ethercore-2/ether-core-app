import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavigationWrapper from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import PopupContact from "@/components/PopupContact";
import WhatsappButton from "@/components/WhatsappButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Global metadata - will be overridden by page-specific metadata
export const metadata: Metadata = {
  title: "EtherCore - Affordable Digital Solutions",
  description: "Your Trusted Partner for Affordable Digital Solutions. We specialize in web development, AI automation, and SEO optimization.",
  keywords: "web development, AI automation, digital solutions, SEO optimization, blog, services, projects",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  alternates: {
    canonical: "https://ether-core.com"
  },
  verification: {
    google: "QCbO-zUumydRn56v3maU_cQAa3JPpVrHuZSuHu4Obgs"
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ LinkedIn Static OG Tags - Required for Featured Section */}
        <meta property="og:title" content="EtherCore - Custom Web Development & AI Automations" />
        <meta property="og:description" content="Co-founded web development studio delivering full-stack websites, AI-powered automations, and digital solutions for businesses looking to scale online." />
        <meta property="og:url" content="https://www.ether-core.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="EtherCore" />
        <meta property="og:image" content="https://www.ether-core.com/android-chrome-512x512.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="EtherCore - Custom Web Development & AI Automations" />
        
        {/* ✅ External CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0f1a] text-white`}>
        <NavigationWrapper />
        {children}
        <Footer />
        <PopupContact />
        <WhatsappButton variant="fixed" />
      </body>
    </html>
  );
}
