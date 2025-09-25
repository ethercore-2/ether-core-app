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

interface CampaignAutomationProps {
  campaignData?: CampaignVideo;
}

const CampaignAutomation = ({ campaignData }: CampaignAutomationProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Default fallback data
  const defaultData: CampaignVideo = {
    id: 1,
    page_slug: 'campaign-automation',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    header_text: 'Automate Your Business with AI-Powered Solutions',
    subtitle_text: 'Custom AI Automation & Workflow Optimization - Transform Your Operations',
    cta_button_text: 'Schedule Automation Consultation',
    cta_button_url: 'https://calendly.com/ethercore/automation-consultation',
    cta_button_text_2: 'Get in Touch',
    cta_button_url_2: '#popup-contact',
    cta_button_icon_2: 'contact',
    autoplay: false,
    muted: true,
    loop_video: false,
    video_type: 'automation_promotional',
    priority: 1
  };

  const data = campaignData || defaultData;

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
      <div className="max-w-6xl mx-auto text-center text-white">
        {/* Clean Layout: Title → Video → Subtitle → CTAs */}
        {/* 1. Title - Mobile Optimized with extra top spacing */}
        <div className="mb-8 sm:mb-12 mt-8 sm:mt-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-300 to-violet-400 bg-clip-text text-transparent leading-tight px-2">
            {data.header_text}
          </h1>
        </div>

        {/* 2. Video - Mobile Optimized with Portrait Aspect Ratio */}
        <div className="relative mb-8 sm:mb-12 max-w-full sm:max-w-4xl mx-auto">
          <div className="relative aspect-[9/16] sm:aspect-video rounded-lg sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
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

        {/* 3. Subtitle - Mobile Optimized */}
        <div className="mb-8 sm:mb-12 px-4">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {data.subtitle_text}
          </p>
        </div>

        {/* 4. CTAs - Mobile Optimized */}
        <div className="flex flex-col gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-4">
          {/* Primary CTA - Automation Consultation */}
          <Link
            href={data.cta_button_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full max-w-md"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-violet-500 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative px-8 py-4 bg-[#0a0f1a] rounded-2xl leading-none flex items-center justify-center space-x-3 group-hover:bg-[#0d1117] transition-all duration-300">
              <Calendar className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
              <span className="text-lg font-semibold text-white group-hover:text-purple-100">
                {data.cta_button_text}
              </span>
            </div>
          </Link>

          {/* Secondary CTA - Database Driven */}
          {(data.cta_button_text_2 && data.cta_button_url_2) && (
            <button
              className="group relative w-full max-w-md cursor-pointer"
              onClick={() => {
                console.log('🔵 Automation Campaign CTA clicked - triggering popup directly');
                // Direct approach - dispatch a more specific event
                const event = new CustomEvent('triggerPopup', { detail: { source: 'automation-campaign' } });
                window.dispatchEvent(event);
              }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative px-8 py-4 bg-transparent border-2 border-purple-500/30 rounded-2xl leading-none flex items-center justify-center space-x-3 group-hover:border-purple-400/50 transition-all duration-300">
                {data.cta_button_icon_2 === 'phone' && <Phone className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />}
                {data.cta_button_icon_2 === 'calendar' && <Calendar className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />}
                                 {data.cta_button_icon_2 === 'email' && (
                   <svg className="w-5 h-5 text-purple-400 group-hover:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z" />
                   </svg>
                 )}
                 {data.cta_button_icon_2 === 'contact' && (
                   <svg className="w-5 h-5 text-purple-400 group-hover:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                   </svg>
                 )}
                <span className="text-lg font-semibold text-purple-300 group-hover:text-purple-200">
                  {data.cta_button_text_2}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CampaignAutomation; 