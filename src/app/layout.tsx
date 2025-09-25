import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import PopupContact from "@/components/PopupContact";
import WhatsappButton from "@/components/WhatsappButton";
import "./globals.css";
import Navigation from '@/components/Navigation';

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
  title: "EtherCore - Digital Solutions",
  description: "Professional web development and digital solutions",
  keywords: "web development, AI automation, digital solutions, SEO optimization, blog, services, projects",
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

// ✅ Separate viewport export as required by Next.js 15
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Service Worker Cleanup Script - Completely removes any existing service workers */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Immediately unregister any existing service workers
            if ('serviceWorker' in navigator) {
              // Clear all service worker registrations
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(let registration of registrations) {
                  registration.unregister();
                  console.log('Service worker unregistered');
                }
              });
              
              // Clear service worker cache
              if ('caches' in window) {
                caches.keys().then(function(cacheNames) {
                  return Promise.all(
                    cacheNames.map(function(cacheName) {
                      if (cacheName.includes('sw') || cacheName.includes('service-worker')) {
                        console.log('Deleting cache:', cacheName);
                        return caches.delete(cacheName);
                      }
                    })
                  );
                });
              }
              
              // Prevent future service worker registrations
              navigator.serviceWorker.register = function() {
                console.log('Service worker registration blocked');
                return Promise.reject(new Error('Service workers are disabled'));
              };
              
              // Override fetch to block sw.js requests
              const originalFetch = window.fetch;
              window.fetch = function(url, options) {
                if (typeof url === 'string' && url.includes('/sw.js')) {
                  console.log('Blocked sw.js fetch request');
                  return Promise.reject(new Error('Service worker requests blocked'));
                }
                return originalFetch.call(this, url, options);
              };
            }
          `
        }} />
        
        {/* ✅ Enhanced preconnect for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ejoimfdulvukutxdznem.supabase.co" />
        <link rel="preconnect" href="https://blog-ether.b-cdn.net" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />
        
        {/* ✅ Critical CSS with performance optimizations */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              background: linear-gradient(to bottom, rgb(13, 34, 49), rgb(10, 25, 47)); 
              color: rgb(255, 255, 255);
              margin: 0;
              padding: 0;
              font-display: swap;
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
            /* Performance improvements */
            * {
              box-sizing: border-box;
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
        
        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1770713604328415');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1770713604328415&ev=PageView&noscript=1"
          />
        </noscript>
        

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0f1a] text-white`}>
        <Navigation />
        <main>{children}</main>
        <Footer />
        <WhatsappButton variant="fixed" />
        <PopupContact />
      </body>
    </html>
  );
}
