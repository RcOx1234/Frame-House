import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Clapperboard, CalendarCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { shouldUseLightAnimations } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

type Commitment = {
  icon: LucideIcon;
  title: string;
  text: string;
  footer: string;
};

const commitments: Commitment[] = [
  {
    icon: Target,
    title: 'Estrategia antes que improvisación',
    text: 'No publicamos por publicar. Cada pieza parte de un objetivo: posicionar, conectar, vender o fortalecer la imagen de tu marca.',
    footer: 'Compromiso 01',
  },
  {
    icon: Clapperboard,
    title: 'Producción cuidada de inicio a fin',
    text: 'Desde la idea hasta la edición final, buscamos que tu contenido se vea profesional, coherente y adaptado a redes sociales.',
    footer: 'Compromiso 02',
  },
  {
    icon: CalendarCheck,
    title: 'Claridad en cada ciclo',
    text: 'Trabajamos con planificación, entregables definidos y revisión constante para que sepas qué se está creando y por qué.',
    footer: 'Compromiso 03',
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

    if (!section || !header || cards.length === 0) return;

    const lightAnimations = shouldUseLightAnimations();

    const ctx = gsap.context(() => {
      gsap.set(header, {
        autoAlpha: 0,
        y: lightAnimations ? 12 : 20,
      });

      gsap.set(cards, {
        autoAlpha: 0,
        y: lightAnimations ? 12 : 22,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
          once: true,
        },
        defaults: {
          ease: 'power3.out',
        },
      });

      tl.to(header, {
        autoAlpha: 1,
        y: 0,
        duration: lightAnimations ? 0.34 : 0.52,
        clearProps: 'opacity,visibility,transform',
      }).to(
        cards,
        {
          autoAlpha: 1,
          y: 0,
          duration: lightAnimations ? 0.32 : 0.48,
          stagger: lightAnimations ? 0.045 : 0.065,
          clearProps: 'opacity,visibility,transform',
        },
        '-=0.18',
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-flowing relative z-30 overflow-hidden border-y border-white/10 bg-gradient-to-b from-[#0B0D10] via-[#0D1014] to-[#111316] py-16 md:py-[11vh]"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(209,44,59,0.10),transparent_26%),radial-gradient(circle_at_82%_78%,rgba(255,255,255,0.04),transparent_24%)]"
        aria-hidden
      />

      <div className="relative px-6 md:px-[7vw]">
        <div
          ref={headerRef}
          className="mb-10 grid gap-6 md:mb-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-10"
        >
          <div>
            <p className="label-mono mb-4 text-muted-warm">CONFIANZA</p>
            <h2 className="headline-lg max-w-[13ch] text-2xl text-off-white md:text-inherit">
              Lo que puedes esperar de Frame House.
            </h2>
          </div>

          <div className="lg:justify-self-end lg:max-w-[470px]">
            <p className="text-sm leading-relaxed text-muted-warm md:text-base">
              Un proceso claro, contenido con intención y una marca que se vea lista para competir.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] font-medium text-off-white/80">
                Proceso claro
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] font-medium text-off-white/80">
                Producción cuidada
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] font-medium text-off-white/80">
                Comunicación constante
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:items-start lg:gap-6">
          {commitments.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.footer}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.055] via-white/[0.03] to-white/[0.015] p-6 shadow-[0_22px_70px_-42px_rgba(0,0,0,0.75)] backdrop-blur-sm transform-gpu will-change-transform transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#D12C3B]/35 md:p-7 lg:min-h-[300px] lg:p-8 ${
                  index === 1 ? 'lg:translate-y-6' : ''
                }`}
              >
                <div
                  className="pointer-events-none absolute right-4 top-2 font-heading text-[4rem] font-bold leading-none text-white/[0.035] md:text-[4.8rem]"
                  aria-hidden
                >
                  0{index + 1}
                </div>

                <div className="relative z-10 mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D12C3B]/30 bg-[#D12C3B]/12 text-[#F07882]"
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#E85A66]">
                      {item.footer}
                    </span>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-warm/75">
                    Frame House
                  </span>
                </div>

                <h3 className="relative z-10 mb-3 max-w-[18ch] font-heading text-xl font-bold leading-tight text-off-white md:text-[1.55rem]">
                  {item.title}
                </h3>

                <p className="relative z-10 flex-1 text-sm leading-relaxed text-muted-warm md:text-base">
                  {item.text}
                </p>

                <div className="relative z-10 mt-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-gradient-to-r from-[#D12C3B]/45 to-transparent" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-warm/60">
                    compromiso real
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center md:mt-10">
          <p className="text-center text-xs text-muted-warm/70 md:text-sm">
            No prometemos volumen sin dirección. Prometemos contenido con criterio.
          </p>
        </div>
      </div>
    </section>
  );
}
