import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { shouldUseLightAnimations } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    label: 'Diagnóstico',
    title: 'Entendemos la marca',
    desc: 'Analizamos negocio, público, oferta y objetivos antes de crear.',
  },
  {
    number: '02',
    label: 'Producción',
    title: 'Creamos con intención',
    desc: 'Planificamos, grabamos, editamos y diseñamos piezas listas para redes.',
  },
  {
    number: '03',
    label: 'Optimización',
    title: 'Mejoramos el siguiente ciclo',
    desc: 'Revisamos resultados, ajustamos formatos y afinamos la estrategia mensual.',
  },
];

const processImage = `${import.meta.env.BASE_URL}images/process-framehouse-system.jpg`;

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
    const stepsPanel = stepsRef.current;
    const stepItems = stepItemsRef.current.filter(Boolean);

    if (!section || !headline || !phone || !stepsPanel) return;
    const lightAnimations = shouldUseLightAnimations();

    const ctx = gsap.context(() => {
      gsap.set([headline, phone, stepsPanel], {
        autoAlpha: 0,
      });

      gsap.set(headline, {
        y: lightAnimations ? 16 : 30,
      });

      gsap.set(phone, {
        y: lightAnimations ? 12 : 24,
        scale: lightAnimations ? 1 : 0.965,
      });

      gsap.set(stepItems, {
        autoAlpha: 0,
        x: lightAnimations ? 0 : 18,
        y: lightAnimations ? 14 : 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
          once: true,
        },
      });

      tl.to(headline, {
        autoAlpha: 1,
        y: 0,
        duration: lightAnimations ? 0.45 : 0.72,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
      })
        .to(
          phone,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: lightAnimations ? 0.5 : 0.82,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
          },
          '-=0.32',
        )
        .to(
          stepsPanel,
          {
            autoAlpha: 1,
            duration: 0.2,
            ease: 'none',
            clearProps: 'opacity,visibility',
          },
          '-=0.45',
        )
        .to(
          stepItems,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: lightAnimations ? 0.38 : 0.58,
            stagger: lightAnimations ? 0.06 : 0.09,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
          },
          '-=0.22',
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-30 overflow-x-hidden bg-[#2A1219] py-14 lg:min-h-[88svh] lg:py-12 xl:py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 px-6 lg:grid-cols-[minmax(300px,355px)_minmax(360px,430px)_minmax(310px,360px)] lg:justify-center lg:gap-9 lg:px-[4vw] xl:max-w-[1360px] xl:grid-cols-[minmax(330px,390px)_minmax(400px,460px)_minmax(330px,380px)] xl:gap-12">
        <div ref={headlineRef} className="text-center lg:text-left">
          <p className="label-mono mb-3 text-muted-warm">METODOLOGÍA</p>

          <h2 className="headline-xl mb-4 text-3xl text-off-white lg:text-[clamp(2.25rem,3.45vw,4.1rem)] lg:leading-[0.96]">
            No publicamos
            <br />
            por publicar.
          </h2>

          <p className="mx-auto max-w-xl text-sm leading-relaxed text-off-white/78 md:text-base lg:mx-0 lg:max-w-[34ch] lg:text-lg">
            Creamos contenido con estrategia, estética profesional e intención comercial.
          </p>

          <div className="mt-6 hidden max-w-[330px] rounded-[24px] border border-white/10 bg-black/15 p-4 backdrop-blur-sm lg:block xl:max-w-[350px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#E85A66]">
              FRAME HOUSE METHOD
            </p>
            <p className="mt-3 text-sm leading-relaxed text-off-white/62">
              Analizamos, producimos y optimizamos para que cada pieza tenga dirección, no solo diseño.
            </p>
          </div>
        </div>

        <div
          ref={phoneRef}
          className="phone-frame relative mx-auto aspect-[4/5] w-[min(72vw,320px)] overflow-hidden lg:aspect-auto lg:h-[min(66svh,560px)] lg:w-full xl:h-[min(70svh,620px)]"
        >
          <img
            src={processImage}
            alt="Sistema de producción y estrategia de contenido de Frame House"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />

          <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-2xl border border-white/10 bg-[#070505]/72 p-3 backdrop-blur-md lg:inset-x-4 lg:bottom-4 lg:p-3.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#E85A66]">
              Sistema de contenido
            </p>
            <p className="mt-1 text-xs font-semibold leading-snug text-off-white lg:text-sm">
              Estrategia → Producción → Mejora
            </p>
          </div>
        </div>

        <div
          ref={stepsRef}
          className="w-full max-w-md justify-self-center lg:max-w-[360px] lg:justify-self-auto xl:max-w-[380px]"
        >
          <div className="rounded-[28px] border border-white/[0.075] bg-white/[0.025] p-4 shadow-[0_22px_60px_-44px_rgba(0,0,0,0.75)] backdrop-blur-sm lg:p-3.5 xl:p-4">
            <div className="mb-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#EADCC2]/60">
                Proceso en 3 fases
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-off-white/55 lg:max-w-[30ch] xl:text-sm">
                Una ruta clara para que tu marca no dependa de contenido improvisado.
              </p>
            </div>

            <div className="flex flex-col">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  ref={(el) => {
                    stepItemsRef.current[index] = el;
                  }}
                  className="group relative grid grid-cols-[38px_1fr] gap-3 pb-3.5 last:pb-0 xl:grid-cols-[42px_1fr] xl:pb-4"
                >
                  {index !== steps.length - 1 && (
                    <span
                      className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-[#D12C3B]/55 to-white/10 xl:left-[21px]"
                      aria-hidden
                    />
                  )}

                  <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#D12C3B]/35 bg-[#170707] font-mono text-[10px] text-[#EADCC2] shadow-[0_0_28px_-16px_rgba(214,30,43,0.8)] transition-colors duration-300 group-hover:border-[#D12C3B]/70 xl:h-10 xl:w-10 xl:text-[11px]">
                    {step.number}
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-black/10 p-3 transition-colors duration-300 group-hover:border-[#D12C3B]/30 group-hover:bg-white/[0.045] xl:p-3.5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#E85A66]">
                      {step.label}
                    </p>
                    <h4 className="mt-1 font-heading text-[15px] font-bold leading-tight tracking-wide text-off-white xl:text-base">
                      {step.title}
                    </h4>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-off-white/62 xl:text-sm xl:leading-[1.55]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-off-white/55 lg:hidden">
            No se trata solo de publicar. Se trata de trabajar cada contenido con intención comercial.
          </p>
        </div>
      </div>
    </section>
  );
}
