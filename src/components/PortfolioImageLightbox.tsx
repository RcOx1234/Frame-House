import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export type PortfolioSlide = { src: string; caption: string };

type PortfolioImageLightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  slides: PortfolioSlide[];
  active: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function PortfolioImageLightbox({
  isOpen,
  onClose,
  slides,
  active,
  onPrev,
  onNext,
}: PortfolioImageLightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const n = slides.length;
  const slide = n > 0 ? slides[Math.min(active, n - 1)] : null;

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    if (isOpen) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(content, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, delay: 0.05 });
    } else {
      gsap.to(content, { scale: 0.92, opacity: 0, duration: 0.2 });
      gsap.to(overlay, { opacity: 0, duration: 0.25, delay: 0.08 });
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, onPrev, onNext]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [isOpen]);

  if (!isOpen || !slide || n === 0) return null;

  const pageLabel = active + 1;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 p-4 opacity-0 backdrop-blur-sm md:p-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-[min(100vw-2rem,1400px)] opacity-0"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-11 right-0 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 md:-top-12 md:h-11 md:w-11"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5 text-off-white" />
        </button>

        <div className="relative max-h-[min(88vh,900px)] overflow-auto rounded-xl border border-white/15 bg-[#0a0a0a] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
          <div className="flex min-h-[40vh] items-center justify-center p-3 md:p-6">
            <img
              src={slide.src}
              alt={slide.caption}
              className="max-h-[min(82vh,860px)] w-auto max-w-full object-contain"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-12 md:px-6 md:pb-5">
            <p className="text-center font-mono text-xs tracking-wider text-white/80">
              Página {pageLabel} de {n}
            </p>
            <p className="mt-1 text-center text-sm text-white/70">{slide.caption}</p>
          </div>

          <button
            type="button"
            aria-label="Anterior"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:border-[#D12C3B]/60 hover:text-[#FF4D5C] md:left-4 md:h-12 md:w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:border-[#D12C3B]/60 hover:text-[#FF4D5C] md:right-4 md:h-12 md:w-12"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
