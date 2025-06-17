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
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Favicon Links */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* ✅ External CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
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
