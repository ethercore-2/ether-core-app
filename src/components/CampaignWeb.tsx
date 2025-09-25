'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Calendar, Phone } from 'lucide-react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/useMediaQuery';

// Updated: Clean layout structure with mobile optimization

interface CampaignVideo {
  id: number;
  page_slug: string;
  video_url: string;
  header_text: string;
  subtitle_text: string;
  cta_button_text: string;
  cta_button_url: string;
  cta_button_text_2?: string;
  cta_button_url_2?: string;
  cta_button_icon_2?: string;
  video_duration?: number;
  video_thumbnail_url?: string;
  autoplay: boolean;
  muted: boolean;
  loop_video: boolean;
  video_type: string;
  priority: number;
  meta_title?: string;
  meta_description?: string;
  video_schema?: Record<string, unknown>;
  video_keywords?: string;
}

interface CampaignWebProps {
  campaignData?: CampaignVideo;
}

const CampaignWeb = ({ campaignData }: CampaignWebProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Default fallback data
  const defaultData: CampaignVideo = {
    id: 1,
    page_slug: 'campaign-web',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    header_text: 'Transform Your Vision into Reality with EtherCore',
    subtitle_text: 'Expert Web Development & AI Automation - Schedule Your Free Consultation',
    cta_button_text: 'Schedule Your Free Consultation',
    cta_button_url: 'https://calendly.com/ethercore/consultation',
    cta_button_text_2: 'Get in Touch',
    cta_button_url_2: '#popup-contact',
    cta_button_icon_2: 'contact',
    autoplay: false,
    muted: true,
    loop_video: false,
    video_type: 'promotional',
    priority: 1
  };

  const data = campaignData || defaultData;

  // Mobile detection is now handled by useIsMobile hook

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial video properties
    video.muted = data.muted;
    video.loop = data.loop_video;
    
    // Mobile-specific video settings
    if (isMobile) {
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      // Disable autoplay on mobile to save data
      video.autoplay = false;
    } else {
      // Auto-play video if configured and not on mobile
      if (data.autoplay && isVideoLoaded) {
        video.play().catch(console.error);
        setIsPlaying(true);
      }
    }
    
    // Set initial mute state
    setIsMuted(data.muted);
  }, [data.autoplay, data.muted, data.loop_video, isVideoLoaded, isMobile]);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        await video.pause();
        setIsPlaying(false);
      } else {
        await video.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error controlling video playback:', error);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative min-h-screen pt-32 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-20 px-4 bg-[#0a0f1a]">
      <div className="max-w-4xl mx-auto text-center text-white">
        {/* Optimized Layout for 9:16 Video: Title → Video → Subtitle → CTAs */}
        {/* 1. Title - Optimized for vertical video layout */}
        <div className="mb-6 sm:mb-8 mt-8 sm:mt-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent leading-tight px-2">
            {data.header_text}
          </h1>
        </div>

        {/* 2. Video - Optimized for 9:16 format on all devices */}
        <div className="relative mb-8 sm:mb-12 max-w-full sm:max-w-2xl mx-auto">
          <div className="relative aspect-[9/16] rounded-lg sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
            <video
              ref={videoRef}
              src={data.video_url}
              className="w-full h-full object-cover"
              onLoadedData={handleVideoLoad}
              playsInline
              webkit-playsinline="true"
              preload={isMobile ? "none" : "metadata"}
              poster={data.video_thumbnail_url}
              title={data.meta_title || data.header_text}
              controls={isMobile}
              muted={data.muted}
              loop={data.loop_video}
            />
            
            {/* Video Controls Overlay - Hidden on mobile since we use native controls */}
            {!isMobile && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    className="group relative p-3 sm:p-4 bg-black/70 backdrop-blur-sm rounded-full border border-white/30 hover:border-white/60 transition-all duration-300 hover:bg-black/80"
                    title={isPlaying ? 'Pause Video' : 'Play Video'}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    ) : (
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" />
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="group relative p-3 sm:p-4 bg-black/70 backdrop-blur-sm rounded-full border border-white/30 hover:border-white/60 transition-all duration-300 hover:bg-black/80"
                    title={isMuted ? 'Unmute Video' : 'Mute Video'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    ) : (
                      <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Subtitle - Optimized for vertical video layout */}
        <div className="mb-6 sm:mb-8 px-4">
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            {data.subtitle_text}
          </p>
        </div>

        {/* 4. CTAs - Optimized for vertical video layout */}
        <div className="flex flex-col gap-4 sm:gap-6 justify-center items-center mb-6 sm:mb-8 px-4">
          {/* Primary CTA - Calendly */}
          <Link
            href={data.cta_button_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl sm:shadow-2xl hover:shadow-teal-500/25"
          >
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            {data.cta_button_text}
            <div className="absolute inset-0 bg-white/20 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Secondary CTA - Database Driven */}
          {(data.cta_button_text_2 && data.cta_button_url_2) && (
            <button
              className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white/30 text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:border-white/60 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => {
                console.log('🔵 Web Campaign CTA clicked - triggering popup directly');
                // Direct approach - dispatch a more specific event
                const event = new CustomEvent('triggerPopup', { detail: { source: 'web-campaign' } });
                window.dispatchEvent(event);
              }}
            >
              {data.cta_button_icon_2 === 'phone' && <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />}
              {data.cta_button_icon_2 === 'calendar' && <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />}
              {data.cta_button_icon_2 === 'email' && (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z" />
                </svg>
              )}
              {data.cta_button_icon_2 === 'contact' && (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )}
              {data.cta_button_text_2}
              <div className="absolute inset-0 bg-white/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          )}
        </div>

        {/* Trust Indicators - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-xs sm:text-sm text-gray-300 px-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
            <span>Free Consultation Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full" />
            <span>Expert Team Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-teal-500 rounded-full" />
            <span>Quick Response Time</span>
          </div>
        </div>
      </div>

      {/* Schema Markup for Video */}
      {data.video_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.video_schema, null, 0)
          }}
        />
      )}
    </section>
  );
};

export default CampaignWeb; 