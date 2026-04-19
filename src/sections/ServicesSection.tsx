import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Video, Film, Target, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Video,
    title: 'Contenido Social',
    items: ['Video short-form', 'Hooks y captions', 'Guía de publicación']
  },
  {
    icon: Film,
    title: 'Brand Films',
    items: ['Concepto de campaña', 'Edición cinematográfica', 'Color y sonido']
  },
  {
    icon: Target,
    title: 'Creative Ads',
    items: ['Variaciones de anuncios', 'Frames que detienen', 'Testing de performance']
  }
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !heading || cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(heading,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 1
          }
        }
      );

      // Cards animation with stagger
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: `top ${75 - index * 5}%`,
              end: `top ${45 - index * 5}%`,
              scrub: 1
            }
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="section-flowing z-20 border-y border-white/10 bg-[#141210] py-16 text-off-white md:py-[12vh]"
    >
      <div className="px-6 md:px-[7vw]">
        <p className="label-mono mb-4 text-muted-warm">Servicios</p>
        {/* Heading */}
        <h2 
          ref={headingRef}
          className="headline-lg mb-10 max-w-full text-off-white md:mb-16 md:max-w-[46vw] text-2xl md:text-inherit"
        >
          Producción full-service para marcas que se mueven rápido.
        </h2>

        {/* Service Cards - Mobile: Stack, Desktop: Row */}
        <div className="flex flex-col gap-6 md:flex-row md:justify-between md:gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={el => { cardsRef.current[index] = el; }}
              className="group flex w-full flex-col rounded-[22px] border border-white/10 bg-[#1C1916]/90 p-6 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-all duration-300 hover:border-[#D12C3B]/35 hover:bg-[#232019] md:h-[54vh] md:w-[26vw] md:p-8"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#D12C3B]/18 md:mb-8 md:h-14 md:w-14">
                <service.icon className="h-6 w-6 text-[#E85A66] md:h-7 md:w-7" />
              </div>
              
              <h3 className="font-heading mb-4 text-xl font-bold tracking-wide text-off-white md:mb-6 md:text-2xl">
                {service.title}
              </h3>
              
              <ul className="flex-1 space-y-2 md:space-y-3">
                {service.items.map((item, i) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-warm md:text-base">
                    <span className="mt-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-[#D12C3B]/35 bg-[#D12C3B]/12 font-mono text-[10px] font-bold text-[#F07882]">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Link */}
        <div className="mt-8 md:mt-12">
          <a 
            href="#portfolio-spotlight" 
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#E85A66] transition-colors hover:text-off-white md:text-base"
          >
            Explorar portafolio
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
