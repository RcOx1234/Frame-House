import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { number: '01', title: 'Descubrir', desc: 'objetivos, audiencia, restricciones' },
  { number: '02', title: 'Planificar', desc: 'dirección creativa + shot list' },
  { number: '03', title: 'Producir', desc: 'filmación + edición + sonido' },
  { number: '04', title: 'Entregar', desc: 'exports, captions, variantes' },
  { number: '05', title: 'Optimizar', desc: 'aprender, iterar, escalar' }
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const stepItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const phone = phoneRef.current;
    const stepItems = stepItemsRef.current.filter(Boolean);

    if (!section || !headline || !phone) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([headline, phone], { opacity: 1 });
      stepItems.forEach(item => gsap.set(item, { opacity: 1 }));

      // Scroll-driven animation - FIXED: removed float animation, adjusted scrub
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.3,
        }
      });

      // ENTRANCE (0-30%) - elements come in
      scrollTl
        .fromTo(headline,
          { x: -60, opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo(phone,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0.05
        );

      // Stagger steps entrance
      stepItems.forEach((step, index) => {
        scrollTl.fromTo(step,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0.08 + index * 0.04
        );
      });

      // EXIT (70-100%) - elements go out
      scrollTl
        .fromTo(headline,
          { x: 0, opacity: 1 },
          { x: -40, opacity: 0, ease: 'power2.in' },
          0.6
        )
        .fromTo(phone,
          { y: 0, opacity: 1 },
          { y: -40, opacity: 0, ease: 'power2.in' },
          0.6
        );

      stepItems.forEach((step) => {
        scrollTl.fromTo(step,
          { x: 0, opacity: 1 },
          { x: 30, opacity: 0, ease: 'power2.in' },
          0.6
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="section-pinned bg-warm-brown z-30"
    >
      {/* Grain overlay for this section */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Mobile Layout */}
      <div className="md:hidden absolute inset-0 flex flex-col items-center justify-center pt-20 pb-10 px-6 overflow-y-auto">
        {/* Headline */}
        <div ref={headlineRef} className="text-center mb-6">
          <h2 className="headline-xl text-off-white mb-2 text-3xl">
            HECHO IN-HOUSE
          </h2>
          <p className="text-base text-off-white/80">
            Del brief a la entrega—sin el caos.
          </p>
        </div>

        {/* Phone Frame */}
        <div 
          ref={phoneRef}
          className="w-[60vw] h-[35vh] phone-frame mb-6"
        >
          <img 
            src="/images/process-camera.jpg" 
            alt="Production Process"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="w-full max-w-sm">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              ref={el => { stepItemsRef.current[index] = el; }}
              className="flex items-start gap-3 py-3 border-b border-white/10 last:border-0"
            >
              <div className="w-8 h-8 rounded-full bg-burnt-orange/20 flex items-center justify-center text-burnt-orange font-mono text-xs font-bold flex-shrink-0">
                {step.number}
              </div>
              <div>
                <h4 className="font-heading font-bold text-off-white text-base">
                  {step.title}
                </h4>
                <p className="text-off-white/60 text-sm">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Left Headline */}
        <div 
          ref={headlineRef}
          className="absolute left-[7vw] top-1/2 -translate-y-1/2 w-[30vw] z-20"
        >
          <h2 className="headline-xl text-off-white mb-4">
            HECHO IN-HOUSE
          </h2>
          <p className="text-xl text-off-white/80 font-light">
            Del brief a la entrega—sin el caos.
          </p>
        </div>

        {/* Center Phone Frame */}
        <div 
          ref={phoneRef}
          className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[78vh] phone-frame z-20"
        >
          <img 
            src="/images/process-camera.jpg" 
            alt="Production Process"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Steps List */}
        <div 
          ref={stepsRef}
          className="absolute left-[72vw] top-1/2 -translate-y-1/2 w-[22vw] z-20"
        >
          <div className="space-y-0">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                ref={el => { stepItemsRef.current[index] = el; }}
                className="process-step"
              >
                <div className="process-step-number">
                  {step.number}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-off-white text-lg tracking-wide">
                    {step.title}
                  </h4>
                  <p className="text-off-white/60 text-sm">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
