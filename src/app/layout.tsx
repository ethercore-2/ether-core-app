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
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

// ✅ Enhanced Global metadata with better favicon configuration
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#0d9488'
      }
    ]
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />
        
        {/* ✅ Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              background: linear-gradient(to bottom, rgb(13, 34, 49), rgb(10, 25, 47)); 
              color: rgb(255, 255, 255);
              margin: 0;
              padding: 0;
            }
            .animate-fade-in { 
              animation: fadeIn 0.6s ease-out; 
            }
            .animate-fade-in-up { 
              animation: fadeInUp 0.8s ease-out 0.2s both; 
            }
            @keyframes fadeIn { 
              from { opacity: 0; } 
              to { opacity: 1; } 
            }
            @keyframes fadeInUp { 
              from { opacity: 0; transform: translateY(20px); } 
              to { opacity: 1; transform: translateY(0); } 
            }
          `
        }} />
        
        {/* ✅ Enhanced favicon and meta tags */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0d9488" />
        <meta name="msapplication-TileColor" content="#0d9488" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
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
        

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0f1a] text-white`}>
        <NavigationWrapper />
        {children}
        <Footer />
        <PopupContact />
        <WhatsappButton variant="fixed" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
