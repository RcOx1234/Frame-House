import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { shouldUseLightAnimations } from '../lib/motion';
import { getProjects } from '../lib/projects';
import { galleryPreviewFallback, type GalleryPreviewItem } from '../data/galleryPreview';

gsap.registerPlugin(ScrollTrigger);

function mapProjectsToPreview(
  projects: Awaited<ReturnType<typeof getProjects>>,
): GalleryPreviewItem[] {
  return projects.slice(0, 6).map((p) => ({
    title: p.title || p.client,
    category:
      p.category === 'Otros'
        ? 'Contenido social'
        : p.category.replace(' / Diseño', '').replace('Branding', 'Diseño'),
    image: p.thumbnail || p.previewImage || '',
  }));
}

const cardTiltClasses = [
  'lg:-rotate-[1.8deg] lg:translate-y-2',
  'lg:rotate-[1.2deg] lg:-translate-y-2',
  'lg:rotate-[2deg] lg:translate-y-1',
  'lg:rotate-[1.4deg] lg:-translate-y-1',
  'lg:-rotate-[1deg] lg:translate-y-3',
  'lg:rotate-[1.6deg] lg:-translate-y-2',
];

export default function GalleryCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [items, setItems] = useState<GalleryPreviewItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const projects = await getProjects();
        const mapped = mapProjectsToPreview(projects).filter((p) => p.image);

        if (cancelled) return;

        if (mapped.length >= 4) {
          setItems(mapped.slice(0, 6));
        } else {
          setItems(galleryPreviewFallback.slice(0, 6));
        }
      } catch {
        if (!cancelled) {
          setItems(galleryPreviewFallback.slice(0, 6));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingItems(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayItems = items.slice(0, 6);
  const skeletonItems = Array.from({ length: 6 });

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const cards = cardsRef.current.filter(Boolean);
    if (!section || !text) return;
    const lightAnimations = shouldUseLightAnimations();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        text,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: lightAnimations ? 0.5 : 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
        },
      );

      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 36, opacity: 0, scale: reducedMotion ? 1 : 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: lightAnimations ? 0.45 : 0.7,
            stagger: 0.07,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 75%', once: true },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion, isLoadingItems]);

  const renderSkeleton = (index: number) => (
    <div
      key={`gallery-skeleton-${index}`}
      ref={(el) => {
        cardsRef.current[index] = el;
      }}
      className={`relative select-none ${index >= 4 ? 'hidden md:block' : ''}`}
    >
      <div
        className={`relative overflow-hidden rounded-[22px] border border-white/8 bg-[#1A0A10]/55 shadow-[0_18px_48px_-22px_rgba(209,44,59,0.32)] ${cardTiltClasses[index] ?? ''}`}
      >
        <div className="aspect-[4/5] w-full animate-pulse bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-[#D12C3B]/[0.08]" />
        <div className="absolute inset-x-3 bottom-3">
          <div className="mb-2 h-2 w-16 rounded-full bg-white/10" />
          <div className="h-3 w-28 rounded-full bg-white/15" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-[#0B0D10]/50" />
      </div>
    </div>
  );

  const renderThumb = (item: GalleryPreviewItem, index: number) => {
    const imageKey = `${item.title}-${index}`;
    const isLoaded = loadedImages[imageKey];

    return (
      <div
        key={imageKey}
        ref={(el) => {
          cardsRef.current[index] = el;
        }}
        className={`relative select-none ${index >= 4 ? 'hidden md:block' : ''}`}
      >
        <div
          className={`group relative overflow-hidden rounded-[22px] border border-white/8 bg-[#1A0A10]/55 shadow-[0_18px_48px_-22px_rgba(209,44,59,0.36)] transition-colors duration-300 hover:border-[#D12C3B]/40 ${cardTiltClasses[index] ?? ''}`}
        >
          {!isLoaded && (
            <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-[#D12C3B]/[0.08]" />
          )}

          <img
            src={item.image}
            alt={`${item.title} — ${item.category}`}
            className={`aspect-[4/5] h-full w-full object-cover transition duration-700 group-hover:scale-[1.035] ${
              isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            }`}
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={() => {
              setLoadedImages((prev) => ({ ...prev, [imageKey]: true }));
            }}
            onError={() => {
              setLoadedImages((prev) => ({ ...prev, [imageKey]: true }));
            }}
          />

          <div
            className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-[#0B0D10]/40"
            aria-hidden
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B0D10]/95 to-transparent px-3 py-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#EADCC2]/80">
              {item.category}
            </p>
            <p className="truncate text-xs font-medium text-off-white">{item.title}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="section-flowing relative z-25 overflow-hidden border-y border-white/10 bg-gradient-to-br from-[#0B0D10] via-[#141210] to-[#1A0A10] py-16 md:py-[12vh]"
    >
      <div
        className="pointer-events-none absolute right-0 top-1/4 h-64 w-64 rounded-full bg-[#D12C3B]/12 blur-[100px] md:h-96 md:w-96"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-6 md:px-[7vw] lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <div ref={textRef}>
          <p className="label-mono mb-4 text-muted-warm">GALERÍA</p>
          <h2 className="headline-lg mb-4 text-2xl text-off-white md:text-inherit">
            Explora más trabajos de Frame House.
          </h2>
          <p className="mb-4 max-w-lg text-sm leading-relaxed text-muted-warm md:text-base">
            Videos, campañas, piezas para redes, contenido promocional y proyectos visuales creados para
            marcas que quieren verse más profesionales.
          </p>
          <p className="mb-8 text-xs text-muted-warm/80 md:text-sm">
            Usa la galería para encontrar referencias visuales antes de pedir tu cotización.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/trabajos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E63E4C] to-[#B01828] px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(214,30,43,0.28)] sm:w-auto"
            >
              Ver galería completa
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/plan-personalizado"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/15 px-6 py-3 text-sm font-semibold text-off-white transition-all hover:border-[#D12C3B]/50 hover:bg-white/5 sm:w-auto"
            >
              Cotizar con una referencia
            </Link>
          </div>
        </div>

        <div className="relative isolate p-1 md:p-2">
          <div
            className="pointer-events-none absolute -inset-8 rounded-[36px] bg-[radial-gradient(circle_at_72%_22%,rgba(209,44,59,0.18),transparent_34%),radial-gradient(circle_at_18%_82%,rgba(255,255,255,0.055),transparent_30%)] blur-[2px] md:hidden"
            aria-hidden
          />

          <div
            className="pointer-events-none absolute -right-10 -top-10 z-0 hidden h-56 w-56 rounded-full bg-[#D12C3B]/18 blur-[86px] md:block"
            aria-hidden
          />

          <div
            className="pointer-events-none absolute -left-12 bottom-4 z-0 hidden h-48 w-48 rounded-full bg-[#D12C3B]/10 blur-[78px] md:block"
            aria-hidden
          />

          <div
            className="pointer-events-none absolute left-1/3 top-1/2 z-0 hidden h-40 w-40 -translate-y-1/2 rounded-full bg-white/[0.035] blur-[70px] md:block"
            aria-hidden
          />

          <div
            className="pointer-events-none absolute left-4 top-8 hidden h-px w-[72%] -rotate-3 bg-gradient-to-r from-transparent via-[#D12C3B]/35 to-transparent md:block"
            aria-hidden
          />

          <div
            className="pointer-events-none absolute bottom-8 right-6 hidden h-px w-[58%] rotate-2 bg-gradient-to-r from-transparent via-white/15 to-transparent md:block"
            aria-hidden
          />

          <div
            className="absolute -left-2 -top-4 z-20 hidden rotate-[-2deg] rounded-2xl border border-[#D12C3B]/25 bg-[#0B0D10]/88 px-4 py-3 shadow-[0_0_40px_rgba(209,44,59,0.18)] backdrop-blur-md md:block"
            aria-hidden
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#D12C3B]">Trabajos reales</p>
            <p className="font-heading text-sm font-bold text-off-white">Galería completa</p>
          </div>

          <div className="relative z-10 select-none grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {isLoadingItems
              ? skeletonItems.map((_, i) => renderSkeleton(i))
              : displayItems.map((item, i) => renderThumb(item, i))}
          </div>
        </div>
      </div>
    </section>
  );
}
