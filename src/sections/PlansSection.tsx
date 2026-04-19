import { useRef, useState } from 'react';
import { Check } from 'lucide-react';

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

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="section-flowing bg-charcoal z-50 min-h-screen"
    >
      {/* Mobile Layout */}
      <div className="lg:hidden absolute inset-0 flex flex-col items-center justify-start pt-14 pb-8 px-6 overflow-y-auto">
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
              className="btn-primary w-full"
            >
              Agendar llamada
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Left Headline */}
        <div 
          ref={headlineRef}
          className="absolute left-[6vw] top-1/2 -translate-y-1/2 w-[24vw] z-30"
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
          className="absolute left-[52%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-[31vw] h-[80vh] phone-frame z-20"
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/plan-growth.jpg`} 
            alt="Growth Plan"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => console.error('Image failed to load:', e)}
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
              className="btn-primary w-full"
            >
              Agendar llamada
            </button>
          </div>
        </div>

        {/* Right Plans List */}
        <div 
          ref={plansListRef}
          className="absolute left-[74vw] top-1/2 -translate-y-1/2 w-[20vw] z-30"
        >
          <div className="space-y-4">
            {plans.map((plan, index) => (
              <button 
                key={plan.name}
                onClick={() => setSelectedPlan(plan)}
                ref={el => { planItemsRef.current[index] = el; }}
                className={`w-full p-6 rounded-xl cursor-pointer transition-all duration-300 text-left ${
                  selectedPlan.name === plan.name
                    ? 'bg-[#4A4A4A]/65 border border-white/30'
                    : 'bg-black/55 border border-white/10 hover:bg-black/70'
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
