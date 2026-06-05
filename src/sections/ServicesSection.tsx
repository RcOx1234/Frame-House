import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import {
  Share2,
  Video,
  LineChart,
  Palette,
  Camera,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { shouldUseLightAnimations } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
};

const services: Service[] = [
  {
    icon: Share2,
    title: 'Gestión de Redes Sociales',
    description:
      'Planificamos, organizamos y publicamos contenido con intención comercial para mantener tu marca activa, coherente y presente.',
    bullets: [
      'Calendario mensual de contenido',
      'Programación y publicación estratégica',
      'Copys enfocados en ventas',
    ],
  },
  {
    icon: Video,
    title: 'Creación de Contenido Audiovisual',
    description:
      'Producimos Reels, TikToks, videos cortos y piezas verticales optimizadas para redes sociales.',
    bullets: [
      'Videos dinámicos para redes',
      'Edición con ritmo, textos y efectos',
      'Contenido pensado para captar atención',
    ],
  },
  {
    icon: LineChart,
    title: 'Estrategia y Análisis de Audiencia',
    description:
      'Antes de publicar, entendemos el negocio, el público y los objetivos para que cada pieza tenga una razón.',
    bullets: [
      'Diagnóstico del negocio',
      'Planificación mensual',
      'Revisión de resultados y ajustes',
    ],
  },
  {
    icon: Palette,
    title: 'Diseño Gráfico para Redes',
    description:
      'Diseñamos afiches, flyers, historias, promociones y piezas visuales adaptadas a cada red social.',
    bullets: [
      'Afiches promocionales',
      'Historias y posts',
      'Piezas visuales para campañas',
    ],
  },
  {
    icon: Camera,
    title: 'Producción Audiovisual',
    description:
      'Nos encargamos de la parte visual de alto impacto: rodaje, dirección creativa, modelo, edición, color y sonido.',
    bullets: [
      'Grabación profesional',
      'Dirección creativa',
      'Edición, color y sonido',
    ],
  },
  {
    icon: Sparkles,
    title: 'Branding y Presencia Digital',
    description:
      'Construimos una imagen más sólida para tu marca, desde identidad visual hasta portafolios y páginas web.',
    bullets: [
      'Identidad de marca',
      'Portafolios profesionales',
      'Páginas web para negocios',
    ],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [showAllServices, setShowAllServices] = useState(false);
  const visibleServices = showAllServices ? services : services.slice(0, 3);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

    if (!section || !header || cards.length === 0) return;

    const lightAnimations = shouldUseLightAnimations();

    const initialCards = cards.slice(0, 3);

    const ctx = gsap.context(() => {
      gsap.set(header, {
        autoAlpha: 0,
        y: lightAnimations ? 16 : 28,
      });

      gsap.set(initialCards, {
        autoAlpha: 0,
        y: lightAnimations ? 18 : 34,
        scale: lightAnimations ? 1 : 0.985,
      });

      const initialIcons = initialCards
        .map((card) => card.querySelector('[data-service-icon]'))
        .filter(Boolean);

      gsap.set(initialIcons, {
        autoAlpha: 0,
        scale: lightAnimations ? 1 : 0.9,
        rotate: lightAnimations ? 0 : -3,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          once: true,
        },
      });

      tl.to(header, {
        autoAlpha: 1,
        y: 0,
        duration: lightAnimations ? 0.45 : 0.72,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
      })
        .to(
          initialCards,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: lightAnimations ? 0.42 : 0.65,
            stagger: lightAnimations ? 0.06 : 0.09,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
          },
          '-=0.28',
        )
        .to(
          initialIcons,
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: lightAnimations ? 0.3 : 0.45,
            stagger: lightAnimations ? 0.04 : 0.06,
            ease: 'back.out(1.7)',
            clearProps: 'transform,opacity,visibility',
          },
          '-=0.48',
        );
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!showAllServices) return;

    const lightAnimations = shouldUseLightAnimations();
    const extras = cardsRef.current.slice(3).filter(Boolean) as HTMLDivElement[];

    if (extras.length === 0) return;

    const frame = requestAnimationFrame(() => {
      gsap.killTweensOf(extras);

      const extraIcons = extras
        .map((card) => card.querySelector('[data-service-icon]'))
        .filter(Boolean);

      gsap.fromTo(
        extras,
        {
          autoAlpha: 0,
          y: lightAnimations ? 12 : 26,
          scale: lightAnimations ? 1 : 0.985,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: lightAnimations ? 0.35 : 0.58,
          stagger: lightAnimations ? 0.05 : 0.08,
          ease: 'power3.out',
          overwrite: 'auto',
          clearProps: 'transform,opacity,visibility',
          onComplete: () => ScrollTrigger.refresh(),
        },
      );

      gsap.fromTo(
        extraIcons,
        {
          autoAlpha: 0,
          scale: lightAnimations ? 1 : 0.9,
          rotate: lightAnimations ? 0 : -3,
        },
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: lightAnimations ? 0.25 : 0.4,
          stagger: lightAnimations ? 0.04 : 0.05,
          ease: 'back.out(1.7)',
          overwrite: 'auto',
          clearProps: 'transform,opacity,visibility',
        },
      );
    });

    return () => cancelAnimationFrame(frame);
  }, [showAllServices]);

  return (
    <section
      ref={sectionRef}
      className="section-flowing z-20 border-y border-white/10 bg-gradient-to-b from-[#141210] to-[#0B0D10] py-16 text-off-white md:py-[12vh]"
    >
      <div className="px-6 md:px-[7vw]">
        <div ref={headerRef} className="mb-10 max-w-3xl md:mb-14">
          <p className="label-mono mb-4 text-muted-warm">SERVICIOS</p>
          <h2 className="headline-lg mb-4 max-w-3xl text-off-white text-2xl md:text-inherit">
            ¿Qué hacemos por tu marca?
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-warm md:text-base md:leading-8">
            No venimos solo a “manejar redes”. Creamos contenido, estrategia y piezas visuales pensadas
            para que tu marca se vea profesional, conecte con su audiencia y venda mejor.
          </p>
        </div>

        <div
          id="framehouse-services-grid"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 md:gap-6"
        >
          {visibleServices.map((service, index) => {
            const Icon = service.icon;
            const num = String(index + 1).padStart(2, '0');
            return (
              <div
                key={service.title}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="group flex transform-gpu will-change-transform flex-col rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.055] via-white/[0.035] to-white/[0.02] p-5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-colors duration-300 hover:border-[#D12C3B]/45 hover:bg-white/[0.07] md:p-6"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div
                    data-service-icon
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D12C3B]/20"
                  >
                    <Icon className="h-5 w-5 text-[#E85A66]" aria-hidden />
                  </div>
                  <span className="font-mono text-xs text-[#EADCC2]/70">{num}</span>
                </div>

                <h3 className="font-heading mb-2 text-lg font-bold tracking-wide text-off-white md:text-xl">
                  {service.title}
                </h3>

                <p className="mb-4 text-sm leading-relaxed text-muted-warm">{service.description}</p>

                <ul className="mt-auto space-y-1.5">
                  {service.bullets.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-muted-warm md:text-sm"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#D12C3B]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {!showAllServices && (
          <div className="mt-8 flex items-center justify-start">
            <button
              type="button"
              aria-expanded={showAllServices}
              aria-controls="framehouse-services-grid"
              onClick={() => setShowAllServices(true)}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-off-white transition-all hover:-translate-y-0.5 hover:border-[#D12C3B]/40 hover:bg-white/[0.06] hover:shadow-[0_14px_44px_-22px_rgba(0,0,0,0.6)] sm:w-auto"
            >
              Ver más servicios
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        )}

        {showAllServices && (
          <div className="mt-8 rounded-[26px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_-36px_rgba(0,0,0,0.7)] md:mt-10 md:flex md:items-center md:justify-between md:gap-8 md:p-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#E85A66]">
                Servicios flexibles
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-warm md:text-base">
                Todos los servicios pueden contratarse por separado o integrarse dentro de un plan mensual según el nivel de crecimiento que busques.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-0 md:shrink-0">
              <a
                href="#plans"
                className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#E63E4C] to-[#B01828] px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(214,30,43,0.28)]"
              >
                Ver planes
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                to="/plan-personalizado"
                className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-white/15 px-6 py-3 text-sm font-semibold text-off-white transition-all hover:border-[#D12C3B]/50 hover:bg-white/5"
              >
                Cotizar servicio
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
