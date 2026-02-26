import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Plan {
  name: string;
  videos: string;
  featured?: boolean;
  features: string[];
  description: string;
}

const plans: Plan[] = [
  { 
    name: 'NORMAL', 
    videos: '4 videos/mes',
    features: ['4 videos/mes', 'Edición básica', 'Captions incluidos', '1 revisión', 'Entrega en 72h'],
    description: 'Perfecto para empezar con contenido consistente'
  },
  { 
    name: 'PROFESIONAL', 
    videos: '12 videos/mes', 
    featured: true,
    features: ['12 videos/mes', 'Edición + captions', 'Guía de publicación', '2 revisiones', 'Entrega en 48h'],
    description: 'El plan más popular para escalar tu presencia'
  },
  { 
    name: 'PLAN DE ESTUDIO', 
    videos: 'Producción + estrategia',
    features: ['Videos ilimitados', 'Producción full-service', 'Estrategia de contenido', 'Revisiones ilimitadas', 'Soporte prioritario'],
    description: 'Solución completa para marcas serias'
  }
];

export default function PlansSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const plansListRef = useRef<HTMLDivElement>(null);
  const planItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[1]); // Default to GROWTH

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const phone = phoneRef.current;
    const planItems = planItemsRef.current.filter(Boolean);

    if (!section || !headline || !phone) return;

    const ctx = gsap.context(() => {
      gsap.set([headline, phone], { opacity: 1 });
      planItems.forEach(item => gsap.set(item, { opacity: 1 }));

      // Scroll-driven animation - FIXED: removed float animation
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

      // Stagger plans entrance
      planItems.forEach((plan, index) => {
        scrollTl.fromTo(plan,
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

      planItems.forEach((plan) => {
        scrollTl.fromTo(plan,
          { x: 0, opacity: 1 },
          { x: 30, opacity: 0, ease: 'power2.in' },
          0.6
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="section-pinned bg-charcoal z-50"
    >
      {/* Mobile Layout */}
      <div className="md:hidden absolute inset-0 flex flex-col items-center justify-center pt-20 pb-10 px-6 overflow-y-auto">
        {/* Headline */}
        <div ref={headlineRef} className="text-center mb-6">
          <h2 className="headline-xl text-off-white mb-2 text-3xl">
            ELIGE UN PLAN
          </h2>
          <p className="text-base text-muted-warm">
            Escala tu contenido sin construir un equipo.
          </p>
        </div>

        {/* Plan Selector */}
        <div className="flex gap-2 mb-6">
          {plans.map((plan) => (
            <button
              key={plan.name}
              onClick={() => setSelectedPlan(plan)}
              className={`px-4 py-2 rounded-lg text-sm font-heading font-bold transition-all ${
                selectedPlan.name === plan.name
                  ? 'bg-burnt-orange text-white'
                  : 'bg-white/10 text-off-white hover:bg-white/20'
              }`}
            >
              {plan.name}
            </button>
          ))}
        </div>

        {/* Featured Plan Card */}
        <div 
          ref={phoneRef}
          className="w-full max-w-sm rounded-2xl overflow-hidden mb-6 relative"
          style={{
            background: selectedPlan.featured 
              ? 'linear-gradient(135deg, rgba(184, 92, 56, 0.15) 0%, rgba(184, 92, 56, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
            border: selectedPlan.featured ? '1px solid rgba(184, 92, 56, 0.3)' : '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div className="p-6">
            {selectedPlan.featured && (
              <span className="label-mono text-burnt-orange mb-2 block text-xs">POPULAR</span>
            )}
            <h3 className="font-heading font-bold text-2xl text-off-white mb-2 tracking-wide">
              {selectedPlan.name}
            </h3>
            <p className="text-muted-warm text-sm mb-4">{selectedPlan.description}</p>
            
            <ul className="space-y-2 mb-6">
              {selectedPlan.features.map((feature) => (
                <li key={feature} className="text-off-white/80 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4 text-burnt-orange" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button 
              onClick={scrollToContact}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Agendar llamada
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Left Headline */}
        <div 
          ref={headlineRef}
          className="absolute left-[7vw] top-1/2 -translate-y-1/2 w-[28vw] z-20"
        >
          <h2 className="headline-xl text-off-white mb-4">
            ELIGE UN PLAN
          </h2>
          <p className="text-xl text-muted-warm font-light">
            Escala tu contenido sin construir un equipo.
          </p>
        </div>

        {/* Center Phone Frame - Featured Plan */}
        <div 
          ref={phoneRef}
          className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[78vh] phone-frame z-20"
        >
          <img 
            src="/Frame-House/images/plan-growth.jpg" 
            alt="Growth Plan"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/70 to-transparent" />
          
          {/* Plan Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            {selectedPlan.featured && (
              <span className="label-mono text-burnt-orange mb-2">POPULAR</span>
            )}
            <h3 className="font-heading font-bold text-3xl text-off-white mb-2 tracking-wide">
              {selectedPlan.name}
            </h3>
            <p className="text-muted-warm text-sm mb-4">{selectedPlan.description}</p>
            
            <ul className="space-y-2 mb-6">
              {selectedPlan.features.map((feature) => (
                <li key={feature} className="text-off-white/80 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4 text-burnt-orange" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button 
              onClick={scrollToContact}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Agendar llamada
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Plans List */}
        <div 
          ref={plansListRef}
          className="absolute left-[72vw] top-1/2 -translate-y-1/2 w-[22vw] z-20"
        >
          <div className="space-y-4">
            {plans.map((plan, index) => (
              <button 
                key={plan.name}
                onClick={() => setSelectedPlan(plan)}
                ref={el => { planItemsRef.current[index] = el; }}
                className={`w-full p-6 rounded-xl cursor-pointer transition-all duration-300 text-left ${
                  selectedPlan.name === plan.name
                    ? 'bg-burnt-orange/20 border border-burnt-orange/40' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <h4 className="font-heading font-bold text-off-white text-lg tracking-wide mb-1">
                  {plan.name}
                </h4>
                <p className="text-muted-warm text-sm">
                  {plan.videos}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
