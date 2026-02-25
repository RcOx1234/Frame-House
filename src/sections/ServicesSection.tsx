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
      className="section-flowing bg-charcoal z-20 py-16 md:py-[12vh]"
    >
      <div className="px-6 md:px-[7vw]">
        {/* Heading */}
        <h2 
          ref={headingRef}
          className="headline-lg text-off-white mb-10 md:mb-16 max-w-full md:max-w-[40vw] opacity-0 text-2xl md:text-inherit"
        >
          Producción full-service para marcas que se mueven rápido.
        </h2>

        {/* Service Cards - Mobile: Stack, Desktop: Row */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-6 md:justify-between">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={el => { cardsRef.current[index] = el; }}
              className="service-card w-full md:w-[26vw] md:h-[54vh] flex flex-col opacity-0 p-6 md:p-8"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-burnt-orange/20 flex items-center justify-center mb-6 md:mb-8">
                <service.icon className="w-6 h-6 md:w-7 md:h-7 text-burnt-orange" />
              </div>
              
              <h3 className="font-heading font-bold text-xl md:text-2xl text-off-white mb-4 md:mb-6 tracking-wide">
                {service.title}
              </h3>
              
              <ul className="space-y-2 md:space-y-3 flex-1">
                {service.items.map((item) => (
                  <li key={item} className="text-muted-warm flex items-center gap-3 text-sm md:text-base">
                    <span className="w-1.5 h-1.5 rounded-full bg-burnt-orange flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Link */}
        <div className="mt-8 md:mt-12">
          <a 
            href="#portfolio" 
            className="inline-flex items-center gap-2 text-burnt-orange hover:text-off-white transition-colors font-medium group text-sm md:text-base"
          >
            Ver trabajos seleccionados
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
