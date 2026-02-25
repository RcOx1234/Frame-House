import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  {
    value: '+120%',
    label: 'Lift promedio en view-through vs baseline',
    chartPath: 'M0,40 Q20,35 40,25 T80,20 T120,15 T160,10'
  },
  {
    value: '3×',
    label: 'Más hooks testeados por campaña',
    chartPath: 'M0,50 Q25,45 50,30 T100,25 T150,15 T200,5'
  },
  {
    value: '48h',
    label: 'Turnaround típico para un batch de contenido',
    chartPath: 'M0,45 Q30,40 60,35 T120,25 T180,20 T240,10'
  }
];

export default function MetricsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const chartsRef = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current.filter(Boolean);
    const charts = chartsRef.current.filter(Boolean);

    if (!section || !heading || cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(heading,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 1
          }
        }
      );

      // Cards animation with stagger
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 50, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: `top ${70 - index * 8}%`,
              end: `top ${45 - index * 8}%`,
              scrub: 1
            }
          }
        );
      });

      // Chart line draw animation
      charts.forEach((chart) => {
        if (!chart) return;
        const length = chart.getTotalLength ? chart.getTotalLength() : 200;
        gsap.set(chart, { strokeDasharray: length, strokeDashoffset: length });
        
        gsap.to(chart, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: chart,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="section-flowing bg-charcoal z-40 py-16 md:py-[12vh]"
    >
      <div className="px-6 md:px-[7vw]">
        {/* Heading */}
        <h2 
          ref={headingRef}
          className="headline-lg text-off-white mb-10 md:mb-16 opacity-0 text-2xl md:text-inherit"
        >
          Construido para performance.
        </h2>

        {/* Metric Cards - Mobile: Stack, Desktop: Row */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {metrics.map((metric, index) => (
            <div
              key={metric.value}
              ref={el => { cardsRef.current[index] = el; }}
              className="metric-card flex-1 opacity-0"
              style={{
                marginTop: window.innerWidth >= 768 && index === 1 ? '4vh' : 0
              }}
            >
              <div className="text-4xl md:text-6xl font-heading font-bold text-burnt-orange mb-3 md:mb-4">
                {metric.value}
              </div>
              
              <p className="text-muted-warm mb-6 md:mb-8 text-sm md:text-base">
                {metric.label}
              </p>
              
              {/* Chart */}
              <svg 
                viewBox="0 0 240 60" 
                className="w-full h-12 md:h-16"
                preserveAspectRatio="none"
              >
                <path
                  ref={el => { chartsRef.current[index] = el; }}
                  d={metric.chartPath}
                  fill="none"
                  stroke="#B85C38"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="chart-line"
                />
              </svg>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-8 md:mt-12 text-muted-warm/60 text-xs md:text-sm">
          Métricas basadas en promedios de clientes de 90 días.
        </p>
      </div>
    </section>
  );
}
