import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  objective: string;
  includes: string[];
  featured?: boolean;
  cta: string;
}

const plans: Plan[] = [
  {
    id: 'impulso',
    name: 'PLAN IMPULSO DIGITAL',
    price: 'USD 280-300 / mes',
    description: 'Ideal para negocios que quieren iniciar su presencia digital con constancia.',
    objective: 'Mantener actividad constante y comenzar a generar interacción y consultas.',
    includes: [
      '4 videos mensuales (Reels / TikTok)',
      '8 afiches promocionales',
      'Copys enfocados en ventas',
      'Calendario mensual + publicación estratégica',
    ],
    cta: 'Elegir plan',
  },
  {
    id: 'crecimiento',
    name: 'PLAN CRECIMIENTO ACTIVO',
    price: 'USD 460-500 / mes',
    description: 'Para negocios que quieren aumentar ventas y destacar frente a la competencia.',
    objective: 'Atraer clientes activamente y generar confianza en tu marca.',
    includes: [
      '8 videos mensuales estratégicos',
      '16 a 20 afiches promocionales',
      '2 sesiones mensuales con modelo',
      'Historias + reporte mensual de resultados',
    ],
    featured: true,
    cta: 'Agendar llamada',
  },
  {
    id: 'dominio',
    name: 'PLAN DOMINIO DIGITAL',
    price: 'USD 690-740 / mes',
    description: 'Para marcas que buscan presencia fuerte y ventas constantes.',
    objective: 'Dominar tu sector con contenido de alto impacto diario.',
    includes: [
      '16-18 videos mensuales',
      'Afiches promocionales por campañas',
      'Sesiones con modelo semanales',
      'Estrategia avanzada + gestión básica',
    ],
    cta: 'Cotizar ahora',
  },
];

export default function PlansSection() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(() => {
    try {
      const stored = window.sessionStorage.getItem('fh_selected_plan');
      return plans.find((p) => p.id === stored) ?? plans[1];
    } catch {
      return plans[1];
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    try {
      window.sessionStorage.setItem('fh_selected_plan', selectedPlan.id);
    } catch {
      // ignore
    }
  }, [selectedPlan.id]);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-flowing z-50 border-y border-white/10 bg-charcoal py-12 md:py-14">
      <div className="px-6 md:px-[7vw]">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-1 gap-6 md:gap-7 lg:grid-cols-2 xl:gap-8 xl:[grid-template-columns:30%_42%_28%]">
            <div className="order-1 max-w-[30rem] text-center md:text-left xl:self-center">
              <p className="label-mono mb-3 text-muted-warm">PLANES MENSUALES</p>
              <h2
                className="font-heading mb-3 text-off-white uppercase font-black leading-[0.95]"
                style={{ fontSize: 'clamp(1.75rem, 3.7vw, 3rem)' }}
              >
                <span className="md:hidden">ELIGE UN PLAN</span>
                <span className="hidden md:inline">ELIGE UN PLAN PERFECTO PARA TU MARCA</span>
              </h2>
              <p className="text-sm leading-relaxed text-off-white/78 md:text-base">
                Planes mensuales que incluyen producción audiovisual, diseño y estrategia. Ahorra hasta un
                82% contratando un plan.
              </p>
              <p className="mt-3 hidden text-sm leading-relaxed text-muted-warm md:block md:text-[0.95rem]">
                Tres niveles diseñados para diferentes etapas de tu negocio. Todos incluyen reuniones de
                seguimiento y acceso directo al equipo.
              </p>
            </div>

            <article
              className={`order-2 overflow-hidden rounded-[22px] border transition-all duration-300 ${
                selectedPlan.featured
                  ? 'border-[#D12C3B]/42 bg-[linear-gradient(145deg,rgba(209,44,59,0.12)_0%,rgba(10,10,10,0.98)_62%)]'
                  : 'border-white/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.05)_0%,rgba(10,10,10,0.98)_65%)]'
              }`}
            >
              <div className="relative h-[145px] w-full sm:h-[165px] md:h-[180px]">
                <img
                  src={`${import.meta.env.BASE_URL}images/plan-growth.jpg`}
                  alt="Plan recomendado"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-[#0B0D10]/95" />
                {selectedPlan.featured && (
                  <span className="label-mono absolute left-3 top-3 rounded-full border border-[#D12C3B]/40 bg-[#D12C3B]/14 px-2.5 py-1 text-[9px] text-[#FF9CA5]">
                    MÁS POPULAR
                  </span>
                )}
              </div>

              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="font-heading text-lg font-bold tracking-wide text-off-white md:text-xl">
                  {selectedPlan.name}
                </h3>
                <p className="mt-1.5 text-sm font-semibold text-[#FF8B97] md:text-base">{selectedPlan.price}</p>
                <p className="mt-2 text-sm text-off-white/85">{selectedPlan.description}</p>

                <ul className="mt-4 space-y-2">
                  {selectedPlan.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-off-white/90">
                      <Check className="mt-0.5 h-3.5 w-3.5 text-[#FF8B97]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-xs text-muted-warm md:text-sm">{selectedPlan.objective}</p>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedPlan.featured) scrollToContact();
                      else navigate('/plan-personalizado');
                    }}
                    className="btn-primary w-full rounded-xl py-2.5 text-sm font-semibold"
                  >
                    {selectedPlan.cta}
                  </button>
                </div>
              </div>
            </article>

            <div className="order-3 lg:col-span-2 xl:col-span-1 xl:self-center xl:pt-6">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
                {plans.map((plan) => {
                  const active = selectedPlan.id === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full rounded-xl border p-3.5 text-left transition-all duration-300 md:p-4 ${
                        active ? 'border-white/30 bg-white/12' : 'border-white/10 bg-black/45 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-heading text-[0.95rem] font-bold tracking-wide text-off-white md:text-base">
                          {plan.name}
                        </h4>
                        {plan.featured && (
                          <span className="rounded-full border border-[#D12C3B]/40 bg-[#D12C3B]/12 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-[#FF9CA5]">
                            RECOMENDADO
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs font-semibold text-[#FF8B97] sm:text-sm">{plan.price}</p>
                      <p className="mt-1.5 text-xs text-muted-warm sm:text-sm">{plan.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center text-center">
            <p className="inline-block text-xs text-muted-warm md:text-sm">
              Todos los planes incluyen seguimiento mensual y acceso directo al equipo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
