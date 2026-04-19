import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Menu } from 'lucide-react';
import QuoteModal from '../components/QuoteModal';
import { useNavigate } from "react-router-dom";


gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onMenuOpen: () => void;
}

export default function HeroSection({ onMenuOpen }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const navigate = useNavigate();
  


  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const phone = phoneRef.current;
    const leftContent = leftContentRef.current;
    const rightContent = rightContentRef.current;
    const nav = navRef.current;
    const scrollIndicator = scrollIndicatorRef.current;

    if (!section || !bg || !phone || !leftContent || !rightContent || !nav || !scrollIndicator) return;

    const ctx = gsap.context(() => {
      // Set initial visible state for load animation
      gsap.set([phone, leftContent, rightContent], { opacity: 1 });

      // Initial load animation
      const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      loadTl
        .fromTo(bg, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.2 })
        .fromTo(phone, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.2)
        .fromTo(leftContent, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9 }, 0.3)
        .fromTo(rightContent, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9 }, 0.4)
        .fromTo(nav, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.5)
        .fromTo(scrollIndicator, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.8);

      // Scroll-driven exit animation - FIXED: removed anticipatePin, adjusted scrub
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=90%',
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back to top
            gsap.set([phone, leftContent, rightContent, bg, scrollIndicator], { 
              opacity: 1, x: 0, y: 0, scale: 1 
            });
          }
        }
      });

      // EXIT phase only - elements fade out as user scrolls
      scrollTl
        .fromTo(scrollIndicator, { opacity: 1 }, { opacity: 0, ease: 'power2.out' }, 0)
        .fromTo(phone, 
          { y: 0, opacity: 1 }, 
          { y: -60, opacity: 0, ease: 'power2.in' }, 
          0.4
        )
        .fromTo(leftContent, 
          { x: 0, opacity: 1 }, 
          { x: -40, opacity: 0, ease: 'power2.in' }, 
          0.4
        )
        .fromTo(rightContent, 
          { x: 0, opacity: 1 }, 
          { x: 40, opacity: 0, ease: 'power2.in' }, 
          0.4
        )
        .fromTo(bg, 
          { scale: 1 }, 
          { scale: 1.03, ease: 'none' }, 
          0
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <QuoteModal 
        isOpen={quoteModalOpen} 
        onClose={() => setQuoteModalOpen(false)}
        onGoToContact={scrollToContact}
      />
      
      <section 
        ref={sectionRef} 
        className="section-pinned bg-charcoal z-10"
      >
        {/* Background Image */}
        <div 
          ref={bgRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-creator.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A0A10]/88 via-[#12060A]/78 to-[#0B0508]/95" />
        </div>

        {/* Navigation */}
        <div 
          ref={navRef}
          className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-[4vw] py-4 md:py-[4vh]"
        >
          <div className="font-heading font-bold text-off-white text-base md:text-lg tracking-wider">
            FRAME HOUSE
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={onMenuOpen}
              className="flex items-center gap-2 font-QuickSand text-xs tracking-widest text-off-white transition-colors hover:text-[#FF6B6B] md:text-sm"
            >
              <Menu className="w-5 h-5 md:hidden" />
              <span className="hidden md:inline">MENU</span>
            </button>
          <a /*href="Menu.html"*/>
              <button
                onClick={() => navigate('/plan-personalizado')}
              className="btn-primary text-xs md:text-sm px-3 py-2 md:px-6 md:py-3"
            >
              <span className="hidden md:inline">Solicitar cotización</span>
              <span className="md:hidden">Cotizar</span>
            </button>
            </a>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden absolute inset-0 pt-14 pb-8 px-6">
          <div
            className="pointer-events-none absolute inset-0 bg-black/50"
            aria-hidden
          />
          <div className="relative z-10 flex h-full min-h-0 flex-col items-center justify-center">
          {/* Phone Frame - Mobile */}
          <div 
            ref={phoneRef}
            className="w-[70vw] h-[45vh] max-h-[48svh] phone-frame mb-5"
          >
            <img 
              src={`${import.meta.env.BASE_URL}images/vertical-creator.jpg`} 
              alt="Vertical Content"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              onError={(e) => console.error('Image failed to load:', e)}
            />
          </div>

          {/* Content - Mobile */}
          <div ref={leftContentRef} className="text-center">
            <h1 className="headline-xl text-off-white mb-3 text-4xl">
              Produce a tu marca
            </h1>
            <p className="text-base text-muted-warm mb-4">
              El nuevo estándar para el storytelling de marca.
            </p>
          </div>

          <div ref={rightContentRef} className="text-center px-4">
            <p className="text-muted-warm mb-4 text-sm leading-relaxed">
              Producimos contenido short-form que se ve premium y performa.
            </p>
            <button 
              onClick={scrollToContact}
              className="btn-primary"
            >
              Contáctanos
            </button>
          </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {/* Left Content */}
          <div 
            ref={leftContentRef}
            className="absolute left-[6vw] top-1/2 -translate-y-1/2 w-[24vw] z-30"
          >
            <h1 className="headline-xl text-off-white mb-4">
              Produce a tu marca
            </h1>
            <p className="text-xl text-muted-warm font-light">
              El nuevo estándar para el storytelling de marca.
            </p>
          </div>

          {/* Center Phone Frame */}
          <div 
            ref={phoneRef}
            className="absolute left-[52%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-[31vw] h-[80vh] phone-frame z-20"
          >
            <img 
              src={`${import.meta.env.BASE_URL}images/vertical-creator.jpg`} 
              alt="Vertical Content"
              className="h-full w-full object-cover object-[center_22%]"
              loading="eager"
              decoding="async"
              onError={(e) => console.error('Image failed to load:', e)}
            />
          </div>

          {/* Right Content */}
          <div 
            ref={rightContentRef}
            className="absolute left-[74vw] top-1/2 -translate-y-1/2 w-[20vw] z-30"
          >
            <p className="text-muted-warm mb-6 leading-relaxed">
              Producimos contenido short-form que se ve premium y performa: 
              producción, edición, hooks y entrega incluidos.
            </p>
            <button 
              onClick={scrollToContact}
              className="btn-primary w-full"
            >
              Contáctanos
            </button>
          </div>
        </div>

        {/* Scroll Indicator — en móvil más cerca del borde inferior para no chocar con Contáctanos */}
        <div 
          ref={scrollIndicatorRef}
          className="absolute left-1/2 z-20 -translate-x-1/2 max-lg:bottom-3 lg:bottom-[6vh]"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="label-mono text-muted-warm text-xs">SCROLL</span>
            <ChevronDown className="scroll-indicator h-5 w-5 text-[#E63E4C]" />
          </div>
        </div>
      </section>
    </>
  );
}
