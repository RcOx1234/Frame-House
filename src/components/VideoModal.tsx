import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    const video = videoRef.current;

    if (!overlay || !content) return;

    if (isOpen) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(content, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, delay: 0.1 });
      if (video) {
        video.play().catch(() => {});
      }
    } else {
      gsap.to(content, { scale: 0.9, opacity: 0, duration: 0.2 });
      gsap.to(overlay, { opacity: 0, duration: 0.3, delay: 0.1 });
      if (video) {
        video.pause();
      }
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4 opacity-0"
      onClick={onClose}
    >
      <div 
        ref={contentRef}
        className="relative w-full max-w-5xl opacity-0"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-burnt-orange/20 transition-colors"
        >
          <X className="w-5 h-5 text-off-white" />
        </button>

        {/* Video Container */}
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full"
              controls
              playsInline
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-burnt-orange/20 flex items-center justify-center mx-auto mb-4">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-burnt-orange border-b-8 border-b-transparent ml-1" />
                </div>
                <p className="text-off-white text-lg font-heading">Video de prueba</p>
                <p className="text-muted-warm text-sm mt-2">Aquí se reproducirá tu video</p>
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        {title && (
          <div className="mt-4">
            <h3 className="font-heading font-bold text-xl text-off-white">{title}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
