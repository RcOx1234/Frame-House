import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Menu } from 'lucide-react';
import QuoteModal from '../components/QuoteModal';
import { useNavigate } from 'react-router-dom';
import { shouldUseLightAnimations } from '../lib/motion';

interface HeroSectionProps {
  onMenuOpen: () => void;
}

export default function HeroSection({ onMenuOpen }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPortfolio = () => {
    const portfolioSection = document.getElementById('portfolio-spotlight');
    if (portfolioSection) portfolioSection.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const nav = navRef.current;
    const left = leftRef.current;
    const panel = panelRef.current;
    const right = rightRef.current;
    if (!section || !nav || !left || !panel || !right) return;
    const lightAnimations = shouldUseLightAnimations();

    const ctx = gsap.context(() => {
      if (lightAnimations) {
        gsap.set([nav, left, panel, right], { opacity: 1, x: 0, y: 0 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(nav, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.55 }, 0)
        .fromTo(left, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.75 }, 0.1)
        .fromTo(panel, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.85 }, 0.16)
        .fromTo(right, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.75 }, 0.2);
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
        className="relative z-10 min-h-[100svh] overflow-hidden bg-[var(--fh-bg-deep)]"
      >
        {/* Gradient background (brief-approved) */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(50% 60% at 32% 40%, rgba(42,11,11,0.85) 0%, rgba(7,5,5,1) 68%), radial-gradient(55% 65% at 58% 45%, rgba(23,7,7,0.75) 0%, rgba(7,5,5,1) 70%), radial-gradient(60% 60% at 80% 0%, rgba(23,7,7,0.40) 0%, rgba(7,5,5,0) 70%)',
          }}
        />

        {/* Red glow behind panel */}
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
          <div className="h-[360px] w-[360px] rounded-full bg-[var(--fh-accent-red)]/16 blur-[70px] lg:h-[640px] lg:w-[640px] lg:blur-[125px]" />
        </div>

        {/* Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(120% 120% at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0.75) 100%)',
          }}
        />

        {/* Header */}
        <div
          ref={navRef}
          className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-[4vw] md:py-7"
        >
          <div className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}images/fh-mark.png`}
              alt="Frame House"
              className="h-9 w-9 rounded-lg border border-white/10 bg-black/35 object-cover shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
              loading="eager"
              decoding="async"
            />
            <div className="font-heading text-sm font-semibold tracking-wider text-[var(--fh-text-white)] md:text-base">
              FRAME HOUSE
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button
              type="button"
              onClick={onMenuOpen}
              className="flex items-center gap-2 text-xs tracking-widest text-[var(--fh-text-white)]/85 transition-colors hover:text-[var(--fh-text-white)] md:text-sm"
            >
              <Menu className="h-5 w-5 md:hidden" />
              <span className="hidden md:inline">MENU</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/plan-personalizado')}
              className="rounded-xl bg-[var(--fh-accent-red)] px-3 py-2 text-xs font-medium text-white shadow-[0_18px_40px_rgba(214,30,43,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--fh-accent-red-dark)] md:px-6 md:py-3 md:text-sm"
            >
              <span className="hidden md:inline">Solicitar cotización</span>
              <span className="md:hidden">Cotizar</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-[100svh] items-center pt-20 pb-10 md:pt-24 md:pb-14">
          <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-16">
            <div className="grid grid-cols-1 items-center gap-8 lg:gap-14 lg:[grid-template-columns:36%_30%_34%]">
              {/* Mobile: label first */}
              <div className="order-1 flex flex-col gap-3 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="h-[2px] w-7 bg-[var(--fh-accent-red)]" />
                  <span className="text-xs tracking-[0.22em] text-[var(--fh-text-cream)]/70 md:text-sm">
                    PRODUCTORA AUDIOVISUAL & AGENCIA DIGITAL
                  </span>
                </div>
              </div>

              {/* Left desktop */}
              <div ref={leftRef} className="order-1 hidden flex-col gap-5 lg:flex lg:order-none">
                <div className="flex items-center gap-3">
                  <div className="h-[2px] w-7 bg-[var(--fh-accent-red)]" />
                  <span className="text-xs tracking-[0.22em] text-[var(--fh-text-cream)]/70 md:text-sm">
                    PRODUCTORA AUDIOVISUAL & AGENCIA DIGITAL
                  </span>
                </div>

                <h1
                  className="font-heading font-black uppercase leading-[0.9] tracking-[-0.04em] text-[var(--fh-text-cream)]"
                  style={{ fontSize: 'clamp(30px, 4.4vw, 66px)' }}
                >
                  PRODUCIMOS <br />
                  CONTENIDO <br />
                  <span className="text-[var(--fh-accent-red)]">QUE VENDE.</span>
                </h1>

                <p className="max-w-[32rem] text-sm leading-relaxed text-[var(--fh-text-muted)] md:text-base">
                  Producción, edición y estrategia de contenido para marcas que quieren crecer.
                </p>

                <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/plan-personalizado')}
                    className="rounded-[18px] bg-[var(--fh-accent-red)] px-6 py-3 text-sm font-medium text-white shadow-[0_18px_44px_rgba(214,30,43,0.26)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--fh-accent-red-dark)] md:text-base"
                  >
                    Solicitar cotización
                  </button>
                  <button
                    type="button"
                    onClick={scrollToPortfolio}
                    className="rounded-[18px] border border-[var(--fh-text-cream)]/35 bg-transparent px-6 py-3 text-sm font-medium text-[var(--fh-text-cream)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/5 md:text-base"
                  >
                    Ver portafolio
                  </button>
                </div>
              </div>

              {/* Center panel */}
              <div ref={panelRef} className="order-2 flex items-center justify-center lg:order-none">
                <div className="relative w-full max-w-[320px] sm:max-w-[390px] lg:max-w-[500px]">
                  <div className="relative mx-auto aspect-[4/4.35] sm:aspect-[4/4.45] lg:aspect-[4/5] overflow-hidden rounded-[28px] bg-[var(--fh-panel-dark)] border border-[#D61E2B]/40 shadow-[0_0_0_1px_rgba(214,30,43,0.28),0_20px_55px_rgba(214,30,43,0.18),0_26px_90px_rgba(0,0,0,0.62)]">
                    <div
                      className="pointer-events-none absolute inset-0"
                      aria-hidden
                      style={{
                        boxShadow:
                          '0 0 0 1px rgba(214,30,43,0.35) inset, 0 0 44px rgba(214,30,43,0.22)',
                      }}
                    />

                    <div className="relative flex h-full items-center justify-center bg-[radial-gradient(110%_90%_at_50%_40%,rgba(214,30,43,0.14)_0%,rgba(214,30,43,0.04)_40%,rgba(10,10,10,0.98)_100%)]">
                      <img
                        src={`${import.meta.env.BASE_URL}images/hero-center-composite.png`}
                        alt="FH device"
                        className="hidden h-full w-full select-none object-contain p-3 lg:block lg:p-4"
                        loading="eager"
                        decoding="async"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `${import.meta.env.BASE_URL}images/hero-logo-main.png`;
                        }}
                      />
                      <img
                        src={`${import.meta.env.BASE_URL}images/hero-logo-main.png`}
                        alt="FH"
                        className="h-full w-full select-none object-contain scale-[1.08] p-4 sm:scale-[1.06] sm:p-5 lg:hidden"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile content after logo */}
              <div className="order-3 flex flex-col gap-5 text-center lg:hidden">
                <h1
                  className="font-heading font-black uppercase leading-[0.9] tracking-[-0.04em] text-[var(--fh-text-cream)]"
                  style={{ fontSize: 'clamp(30px, 9.5vw, 48px)' }}
                >
                  PRODUCIMOS <br />
                  CONTENIDO <br />
                  <span className="text-[var(--fh-accent-red)]">QUE VENDE.</span>
                </h1>

                <p className="text-sm leading-relaxed text-[var(--fh-text-muted)]">
                  Producción, edición y estrategia de contenido para marcas que quieren crecer.
                </p>

                <button
                  type="button"
                  onClick={scrollToContact}
                  className="mx-auto w-full max-w-[320px] rounded-[18px] bg-[var(--fh-accent-red)] px-6 py-3 text-sm font-medium text-white shadow-[0_18px_44px_rgba(214,30,43,0.22)] transition-all duration-300 hover:bg-[var(--fh-accent-red-dark)]"
                >
                  Contáctanos
                </button>
              </div>

              {/* Right */}
              <div ref={rightRef} className="order-3 hidden flex-col gap-6 text-left lg:flex lg:order-none">
                <div className="text-sm leading-relaxed text-[var(--fh-text-cream)] sm:text-base md:text-lg">
                  Contenido short-form <br />
                  de alto nivel.
                  <div className="mt-3 text-[var(--fh-text-muted)]">
                    Estrategia, producción <br />
                    y entrega incluidos.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={scrollToContact}
                  className="w-fit rounded-[18px] bg-[var(--fh-accent-red)] px-6 py-3 text-sm font-medium text-white shadow-[0_18px_44px_rgba(214,30,43,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--fh-accent-red-dark)] md:text-base"
                >
                  Contáctanos
                </button>

                <span className="text-xs text-[var(--fh-text-muted)] md:text-sm">
                  Respuesta en menos de 24h
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
