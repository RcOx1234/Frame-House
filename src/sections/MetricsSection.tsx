import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { shouldUseLightAnimations } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

const growthCards = [
  {
    value: '01',
    title: 'Diagnóstico comercial',
    description:
      'Antes de crear, entendemos tu negocio, tu público y qué debe comunicar tu marca para diferenciarse.',
  },
  {
    value: '02',
    title: 'Producción con intención',
    description:
      'Cada video, afiche o historia se diseña para cumplir un objetivo: informar, atraer, generar confianza o impulsar consultas.',
  },
  {
    value: '03',
    title: 'Optimización mensual',
    description:
      'Revisamos el desempeño del contenido y ajustamos ideas, formatos y mensajes para mejorar el siguiente mes.',
  },
];

export default function MetricsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !header || cards.length === 0) return;
    const lightAnimations = shouldUseLightAnimations();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        header,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: lightAnimations ? 0.5 : 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
        },
      );

      gsap.fromTo(
        cards,
        { y: 36, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: lightAnimations ? 0.45 : 0.7,
          stagger: lightAnimations ? 0.07 : 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-flowing z-40 bg-gradient-to-b from-[#0B0D10] via-[#141210] to-[#0B0D10] py-16 md:py-[12vh]"
    >
      <div className="px-6 md:px-[7vw]">
        <div ref={headerRef} className="mb-10 md:mb-16">
          <p className="label-mono mb-4 text-muted-warm">SISTEMA DE CRECIMIENTO</p>
          <h2 className="headline-lg mb-4 text-2xl text-off-white md:text-inherit">
            Contenido que se crea, se publica y se mejora.
          </h2>
          <p className="max-w-2xl text-sm text-muted-warm md:text-base">
            Trabajamos cada plan con una lógica clara: entender la marca, producir con intención y revisar
            qué puede optimizarse en el siguiente ciclo.
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          {growthCards.map((card, index) => (
            <div
              key={card.value}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={`metric-card flex-1 border border-white/10 bg-white/[0.03] ${index === 1 ? 'md:mt-[2vh]' : ''}`}
            >
              <div className="mb-3 font-mono text-4xl font-bold text-[#D12C3B] md:mb-4 md:text-5xl">
                {card.value}
              </div>
              <h3 className="font-heading mb-3 text-lg font-bold text-off-white md:text-xl">{card.title}</h3>
              <p className="text-sm leading-relaxed text-muted-warm md:text-base">{card.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 hidden text-sm text-muted-warm/70 md:mt-12 md:block">
          Tres fases, un mismo objetivo: que tu marca crezca con contenido que tiene dirección, no solo
          volumen.
        </p>
      </div>
    </section>
  );
}
