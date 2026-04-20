import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu } from 'lucide-react';
import QuoteModal from '../components/QuoteModal';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onMenuOpen: () => void;
}

export default function HeroSection({ onMenuOpen }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const phoneMobileRef = useRef<HTMLDivElement>(null);
  const phoneDesktopRef = useRef<HTMLDivElement>(null);
  const leftMobileRef = useRef<HTMLDivElement>(null);
  const leftDesktopRef = useRef<HTMLDivElement>(null);
  const rightMobileRef = useRef<HTMLDivElement>(null);
  const rightDesktopRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [isDesktopInput, setIsDesktopInput] = useState(false);
  const navigate = useNavigate();

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const desktopInputMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateDesktopInput = () => setIsDesktopInput(desktopInputMedia.matches);
    updateDesktopInput();

    if (desktopInputMedia.addEventListener) {
      desktopInputMedia.addEventListener('change', updateDesktopInput);
    } else {
      desktopInputMedia.addListener(updateDesktopInput);
    }

    return () => {
      if (desktopInputMedia.addEventListener) {
        desktopInputMedia.removeEventListener('change', updateDesktopInput);
      } else {
        desktopInputMedia.removeListener(updateDesktopInput);
      }
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const nav = navRef.current;

    if (!section || !bg || !nav) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const phone = phoneDesktopRef.current;
      const leftContent = leftDesktopRef.current;
      const rightContent = rightDesktopRef.current;
      if (!phone || !leftContent || !rightContent) return () => {};

      const ctx = gsap.context(() => {
        gsap.set([phone, leftContent, rightContent], { opacity: 1 });

        const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        loadTl
          .fromTo(bg, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.2 })
          .fromTo(phone, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.2)
          .fromTo(leftContent, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9 }, 0.3)
          .fromTo(rightContent, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9 }, 0.4)
          .fromTo(nav, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.5);

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=90%',
            pin: true,
            scrub: 0.45,
            anticipatePin: 1,
            onLeaveBack: () => {
              gsap.set([phone, leftContent, rightContent, bg], {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
              });
            },
          },
        });

        scrollTl
          .fromTo(phone, { y: 0, opacity: 1 }, { y: -60, opacity: 0, ease: 'power2.in' }, 0.4)
          .fromTo(leftContent, { x: 0, opacity: 1 }, { x: -40, opacity: 0, ease: 'power2.in' }, 0.4)
          .fromTo(rightContent, { x: 0, opacity: 1 }, { x: 40, opacity: 0, ease: 'power2.in' }, 0.4)
          .fromTo(bg, { scale: 1 }, { scale: 1.03, ease: 'none' }, 0);
      }, section);

      return () => ctx.revert();
    });

    mm.add('(max-width: 1023px)', () => {
      const phone = phoneMobileRef.current;
      const leftContent = leftMobileRef.current;
      const rightContent = rightMobileRef.current;
      if (!phone || !leftContent || !rightContent) return () => {};

      const ctx = gsap.context(() => {
        gsap.set([phone, leftContent, rightContent], { opacity: 1 });

        const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        loadTl
          .fromTo(bg, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.2 })
          .fromTo(phone, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.2)
          .fromTo(leftContent, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9 }, 0.3)
          .fromTo(rightContent, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9 }, 0.4)
          .fromTo(nav, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.5);
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        onGoToContact={scrollToContact}
      />

      <section ref={sectionRef} className="section-pinned bg-charcoal z-10">
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

        <div
          className="pointer-events-none absolute inset-0 z-[1] hidden bg-black/45 lg:block"
          aria-hidden
        />

        <div
          ref={navRef}
          className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-4 md:px-[4vw] md:py-[4vh]"
        >
          <div className="font-heading text-base font-bold tracking-wider text-off-white md:text-lg">
            FRAME HOUSE
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <button
              type="button"
              onClick={onMenuOpen}
              className="flex items-center gap-2 font-QuickSand text-xs tracking-widest text-off-white transition-colors hover:text-[#FF6B6B] md:text-sm"
            >
              <Menu className="h-5 w-5 md:hidden" />
              <span className="hidden md:inline">MENU</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/plan-personalizado')}
              className="btn-primary px-3 py-2 text-xs md:px-6 md:py-3 md:text-sm"
            >
              <span className="hidden md:inline">Solicitar cotización</span>
              <span className="md:hidden">Cotizar</span>
            </button>
          </div>
        </div>

        <div className={`absolute inset-0 pt-14 pb-8 px-6 ${isDesktopInput ? 'hidden' : 'lg:hidden'}`}>
          <div className="pointer-events-none absolute inset-0 bg-black/50" aria-hidden />
          <div className="relative z-10 flex h-full min-h-0 flex-col items-center justify-center">
            <div ref={phoneMobileRef} className="phone-frame mb-5 h-[45vh] max-h-[48svh] w-[70vw]">
              <img
                src={`${import.meta.env.BASE_URL}images/vertical-creator.jpg`}
                alt="Vertical Content"
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
                onError={(e) => console.error('Image failed to load:', e)}
              />
            </div>

            <div ref={leftMobileRef} className="text-center">
              <h1 className="headline-xl mb-3 text-4xl text-off-white">Produce a tu marca</h1>
              <p className="mb-4 text-base text-muted-warm">
                El nuevo estándar para el storytelling de marca.
              </p>
            </div>

            <div ref={rightMobileRef} className="px-4 text-center">
              <p className="mb-4 text-sm leading-relaxed text-muted-warm">
                Producimos contenido short-form que se ve premium y performa.
              </p>
              <button type="button" onClick={scrollToContact} className="btn-primary">
                Contáctanos
              </button>
            </div>
          </div>
        </div>

        <div className={isDesktopInput ? 'block' : 'hidden lg:block'}>
          <div
            ref={leftDesktopRef}
            className="absolute left-[6vw] top-1/2 z-30 w-[24vw] -translate-y-1/2"
          >
            <h1 className="headline-xl mb-4 text-off-white">Produce a tu marca</h1>
            <p className="text-xl font-light text-muted-warm">
              El nuevo estándar para el storytelling de marca.
            </p>
          </div>

          <div
            ref={phoneDesktopRef}
            className="phone-frame absolute left-[52%] z-20 h-[74vh] w-[31vw] -translate-x-1/2"
            style={{ top: '10vh' }}
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

          <div
            ref={rightDesktopRef}
            className="absolute left-[74vw] top-1/2 z-30 w-[20vw] -translate-y-1/2"
          >
            <p className="mb-6 leading-relaxed text-muted-warm">
              Producimos contenido short-form que se ve premium y performa: producción, edición,
              hooks y entrega incluidos.
            </p>
            <button type="button" onClick={scrollToContact} className="btn-primary w-full">
              Contáctanos
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
