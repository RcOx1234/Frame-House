import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Check, Copy, ExternalLink, Globe, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster, toast } from 'sonner';
import { shouldUseLightAnimations } from '../lib/motion';
import { getProjects, type Project } from '../lib/projects';
import { ProjectMediaCarousel } from '../components/ProjectMediaCarousel';

type ProjectType = 'video' | 'web' | 'social' | 'branding' | 'fotografia' | 'otros';
type FilterType = 'Todos' | 'Videos' | 'Webs' | 'Contenido Social' | 'Branding / Diseño' | 'Fotografía' | 'Otros';

import { buildWhatsAppUrl } from '../config/contact';
const FILTERS: FilterType[] = ['Todos', 'Videos', 'Webs', 'Contenido Social', 'Branding / Diseño', 'Fotografía', 'Otros'];
gsap.registerPlugin(ScrollTrigger);

function typeIcon(type: ProjectType) {
  if (type === 'video' || type === 'social') return <Play className="w-4 h-4" />;
  if (type === 'web') return <Globe className="w-4 h-4" />;
  return <Camera className="w-4 h-4" />;
}

function ProjectCardSkeleton({ featured }: { featured?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border bg-white/[0.035] ${
        featured ? 'border-[#D12C3B]/25' : 'border-white/10'
      }`}
    >
      <div className="aspect-[4/3] animate-pulse bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-[#D12C3B]/[0.08] md:aspect-[4/3] xl:aspect-[5/4]" />
      <div className="absolute inset-x-4 bottom-4">
        <div className="mb-2 h-3 w-24 rounded-full bg-white/10" />
        <div className="h-5 w-40 rounded-full bg-white/15" />
      </div>
    </div>
  );
}

export default function TrabajosPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [pageVisible, setPageVisible] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const filtersRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalPanelRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const previousVisibleCountRef = useRef(6);
  const hasAnimatedInitialLoadRef = useRef(false);
  const isFirstFilterEffectRef = useRef(true);

  const filteredProjects = useMemo(() => {
    const ranked = [...projects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    if (activeFilter === 'Todos') return ranked;
    return ranked.filter((project) => project.category === activeFilter);
  }, [activeFilter, projects]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredProjects.length;

  useEffect(() => {
    async function load() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (loadError) {
        console.error(loadError);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const frameId = window.requestAnimationFrame(() => setPageVisible(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    setVisibleCount(6);
    previousVisibleCountRef.current = 6;
  }, [activeFilter]);

  const closeModal = useCallback(() => {
    const overlay = modalOverlayRef.current;
    const panel = modalPanelRef.current;

    if (!overlay || !panel) {
      setSelectedProject(null);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => setSelectedProject(null)
    });
    tl.to(panel, { y: 12, opacity: 0, scale: 0.985, duration: 0.2, ease: 'power2.inOut' }, 0);
    tl.to(overlay, { opacity: 0, duration: 0.18, ease: 'power2.inOut' }, 0);
  }, []);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedProject) closeModal();
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [closeModal, selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [selectedProject]);

  useEffect(() => {
    const root = pageRef.current;
    const grid = gridRef.current;
    if (!root || !headerRef.current || !filtersRef.current || !grid || !ctaRef.current) return;
    if (loading) return;

    const lightAnimations = shouldUseLightAnimations();

    const ctx = gsap.context(() => {
      const cards = Array.from(grid.querySelectorAll('[data-project-card]'));

      gsap.set([headerRef.current, filtersRef.current], { autoAlpha: 0, y: 24 });
      if (cards.length) {
        gsap.set(cards, { autoAlpha: 0, y: 24, scale: lightAnimations ? 1 : 0.985 });
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(headerRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: lightAnimations ? 0.4 : 0.7,
        clearProps: 'transform,opacity,visibility',
      })
        .to(
          filtersRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: lightAnimations ? 0.32 : 0.52,
            clearProps: 'transform,opacity,visibility',
          },
          '-=0.32',
        );

      if (cards.length) {
        tl.to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: lightAnimations ? 0.32 : 0.55,
            stagger: lightAnimations ? 0.035 : 0.06,
            clearProps: 'transform,opacity,visibility',
          },
          '-=0.18',
        );
        hasAnimatedInitialLoadRef.current = true;
      }

      gsap.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: lightAnimations ? 0.3 : 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 90%',
            once: true
          }
        }
      );
    }, root);

    return () => ctx.revert();
  }, [loading]);

  useEffect(() => {
    if (!selectedProject || !modalOverlayRef.current || !modalPanelRef.current) return;

    const overlay = modalOverlayRef.current;
    const panel = modalPanelRef.current;
    gsap.set(overlay, { opacity: 0 });
    gsap.set(panel, { opacity: 0, y: 14, scale: 0.985 });

    const tl = gsap.timeline();
    tl.to(overlay, { opacity: 1, duration: 0.18, ease: 'power2.out' }, 0);
    tl.to(panel, { opacity: 1, y: 0, scale: 1, duration: 0.24, ease: 'power2.out' }, 0.03);
  }, [selectedProject]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      previousVisibleCountRef.current = visibleCount;
      return;
    }

    const previousCount = previousVisibleCountRef.current;
    const currentCount = visibleCount;
    previousVisibleCountRef.current = currentCount;

    if (currentCount <= previousCount) return;

    const cards = Array.from(grid.querySelectorAll('[data-project-card]'));
    const newCards = cards.slice(previousCount, currentCount);
    if (newCards.length === 0) return;

    gsap.fromTo(
      newCards,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.26,
        stagger: 0.07,
        ease: 'power2.out',
        clearProps: 'opacity,transform'
      }
    );
  }, [visibleCount]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || loading) return;

    if (isFirstFilterEffectRef.current) {
      isFirstFilterEffectRef.current = false;
      return;
    }

    const cards = Array.from(grid.querySelectorAll('[data-project-card]'));
    if (!cards.length) return;

    const lightAnimations = shouldUseLightAnimations();
    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 16 },
      {
        autoAlpha: 1,
        y: 0,
        duration: lightAnimations ? 0.28 : 0.38,
        stagger: lightAnimations ? 0.03 : 0.05,
        ease: 'power2.out',
        clearProps: 'transform,opacity,visibility'
      }
    );
  }, [activeFilter, loading]);

  const handleCopyReference = async (ref: string) => {
    try {
      await navigator.clipboard.writeText(ref);
      setCopiedRef(ref);
      toast.success('Referencia copiada');
      window.setTimeout(() => setCopiedRef(null), 2000);
    } catch {
      toast.error('No se pudo copiar la referencia');
    }
  };

  const renderProjectCard = (project: Project, index: number) => {
    const isFeatured = index === 0 && activeFilter === 'Todos';

    return (
      <button
        type="button"
        key={project.id}
        data-project-card
        onClick={() => setSelectedProject(project)}
        className={`group relative isolate aspect-[4/3] overflow-hidden rounded-[26px] border bg-white/[0.025] text-left shadow-[0_24px_70px_-46px_rgba(0,0,0,0.85)] [transform:translateZ(0)] [backface-visibility:hidden] will-change-transform transition-[transform,border-color,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-48px_rgba(209,44,59,0.35)] focus:outline-none md:aspect-[4/3] xl:aspect-[5/4] ${
          isFeatured
            ? 'border-[#D12C3B]/28 shadow-[0_28px_90px_-54px_rgba(209,44,59,0.45)] hover:border-[#D12C3B]/45'
            : 'border-white/10 hover:border-[#D12C3B]/35'
        }`}
      >
        <div className="absolute inset-[-1px] overflow-hidden rounded-[26px] [transform:translateZ(0)] [backface-visibility:hidden]">
          <img
            src={project.thumbnail || project.previewImage}
            alt={project.title}
            className="h-full w-full object-cover [transform:translateZ(0)_scale(1.01)] [backface-visibility:hidden] will-change-transform transition-transform duration-700 group-hover:scale-[1.045]"
            loading="lazy"
            decoding="async"
          />

          {project.previewVideo ? (
            <video
              src={project.previewVideo}
              muted
              loop
              playsInline
              preload="none"
              className="pointer-events-none absolute inset-0 h-full w-full rounded-[26px] object-cover [transform:translateZ(0)_scale(1.01)] [backface-visibility:hidden] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          ) : null}

          <div className="absolute inset-[-1px] rounded-[26px] bg-gradient-to-b from-black/10 via-black/10 to-[#0B0D10]/92" />
          <div className="absolute inset-[-1px] rounded-[26px] bg-[radial-gradient(circle_at_50%_0%,rgba(209,44,59,0.22),transparent_38%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-5">
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-off-white/90 backdrop-blur-sm">
              {project.client}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-off-white/90 backdrop-blur-sm">
              {typeIcon(project.type)}
              {project.type}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EADCC2]/70">
              {project.category}
            </p>
            <h3 className="font-heading text-xl font-bold leading-tight text-off-white md:text-[1.45rem] lg:text-[1.6rem]">
              {project.title}
            </h3>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-sm text-off-white/70">{project.format || project.type}</p>
              <span className="hidden items-center gap-1 rounded-full border border-[#D12C3B]/25 bg-[#D12C3B]/10 px-3 py-1 text-xs font-semibold text-[#E85A66] opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:inline-flex">
                Ver proyecto
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div
      ref={pageRef}
      className={`relative min-h-screen overflow-hidden bg-[#0B0D10] text-off-white transition-opacity duration-300 ${pageVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_18%_8%,rgba(209,44,59,0.16),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(255,255,255,0.04),transparent_24%),linear-gradient(180deg,#0B0D10_0%,#09090B_48%,#12070A_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#0B0D10',
            border: '1px solid rgba(209, 44, 59, 0.35)',
            color: '#F3F1EA'
          }
        }}
      />

      <main className="relative z-10 mx-auto max-w-[1440px] px-6 py-10 md:px-[7vw] md:py-14 lg:py-16">
        <header
          ref={headerRef}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.025] p-6 shadow-[0_28px_90px_-56px_rgba(0,0,0,0.95)] md:p-8 lg:p-10"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(209,44,59,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_22%)]"
            aria-hidden
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.62fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#E85A66] md:text-sm">
                PORTAFOLIO
              </p>

              <h1 className="mt-4 max-w-[12ch] font-heading text-[clamp(2.6rem,6vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-off-white">
                Trabajos que hablan por tu marca.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-off-white/70 md:text-lg">
                Explora proyectos reales: videos, contenido social, sitios web, campañas y piezas visuales creadas para marcas que buscan verse más profesionales.
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-[#0B0D10]/55 p-4 backdrop-blur-sm">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#EADCC2]/65">
                Galería Frame House
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-warm">
                Usa esta página como referencia visual. Abre un proyecto, copia su referencia y cotiza algo con una dirección parecida.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#D12C3B]/30 bg-[#D12C3B]/10 px-3 py-1.5 text-xs text-off-white/85">
                  Videos
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-off-white/75">
                  Webs
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-off-white/75">
                  Contenido social
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-warm transition-colors hover:text-off-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Volver al inicio
          </Link>

          {!loading && !error ? (
            <p className="hidden text-sm text-muted-warm/70 md:block">
              {filteredProjects.length} proyectos encontrados
            </p>
          ) : null}
        </div>

        <section
          ref={filtersRef}
          className="sticky top-0 z-20 -mx-6 mt-8 border-y border-white/10 bg-[#0B0D10]/82 px-6 py-4 backdrop-blur-xl md:-mx-[7vw] md:px-[7vw]"
        >
          <div className="mx-auto flex max-w-[1440px] items-center gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'border-[#D12C3B] bg-[#D12C3B]/16 text-off-white shadow-[0_0_28px_-18px_rgba(209,44,59,0.85)]'
                    : 'border-white/12 bg-white/[0.025] text-muted-warm hover:border-[#D12C3B]/45 hover:text-off-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {error ? (
          <p className="mt-8 text-sm text-[#D12C3B]">No se pudieron cargar los proyectos</p>
        ) : null}

        <section
          ref={gridRef}
          className="mt-8 grid grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ProjectCardSkeleton key={index} featured={index === 0} />
              ))
            : visibleProjects.length > 0
              ? visibleProjects.map((project, index) => renderProjectCard(project, index))
              : (
                <div className="col-span-full rounded-[28px] border border-white/10 bg-white/[0.035] p-8 text-center">
                  <p className="font-heading text-xl font-bold text-off-white">
                    Todavía no hay trabajos en esta categoría.
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-warm">
                    Prueba con otro filtro o vuelve a &ldquo;Todos&rdquo; para explorar la galería completa.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('Todos')}
                    className="mt-5 rounded-full border border-[#D12C3B]/40 px-5 py-2 text-sm font-semibold text-off-white hover:bg-[#D12C3B]/10"
                  >
                    Ver todos
                  </button>
                </div>
              )}
        </section>

        {canLoadMore ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 6)}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-6 py-3 text-sm font-semibold text-off-white transition-all hover:-translate-y-0.5 hover:border-[#D12C3B]/45 hover:bg-white/[0.06]"
            >
              Cargar más trabajos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        ) : null}

        <section
          ref={ctaRef}
          className="relative mt-16 overflow-hidden rounded-[32px] border border-[#D12C3B]/25 bg-white/[0.025] p-7 shadow-[0_28px_90px_-56px_rgba(0,0,0,0.95)] md:mt-20 md:p-10"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_50%,rgba(209,44,59,0.14),transparent_40%)]"
            aria-hidden
          />
          <div className="relative">
            <h2 className="font-heading text-2xl font-bold text-off-white md:text-4xl">
              ¿Quieres resultados como estos?
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-warm md:text-base">
              Cuéntanos tu objetivo y te proponemos la estrategia ideal para tu marca.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/#plans"
                className="rounded-full border border-[#D12C3B] bg-[#D12C3B] px-5 py-2.5 text-sm font-semibold text-off-white transition hover:bg-[#B51823]"
              >
                Cotizar
              </Link>
              <a
                href={buildWhatsAppUrl('Hola, quiero cotizar un proyecto con Frame House')}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-off-white transition hover:border-[#D12C3B]/60 hover:text-[#E85A66]"
              >
                WhatsApp directo
              </a>
            </div>
          </div>
        </section>
      </main>

      {selectedProject ? (
        <div
          ref={modalOverlayRef}
          className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-[#070505]/88 p-4 pt-8 backdrop-blur-sm md:items-center md:p-8"
          onClick={closeModal}
        >
          <div
            ref={modalPanelRef}
            className="relative grid w-full max-w-6xl overflow-hidden rounded-[30px] border border-white/10 bg-[#0B0D10] shadow-[0_40px_100px_rgba(0,0,0,0.75)] md:max-h-[90vh] lg:grid-cols-[1.2fr_0.8fr]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-black/50 p-2 text-off-white/90 transition hover:border-[#D12C3B]/50 hover:text-[#E85A66]"
              aria-label="Cerrar modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative min-h-[240px] bg-black md:min-h-[320px] lg:min-h-0">
              <ProjectMediaCarousel project={selectedProject} />
            </div>

            <div className="flex flex-col overflow-y-auto p-6 md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs text-off-white/85">
                  {selectedProject.client}
                </span>
                <span className="rounded-full border border-[#D12C3B]/30 bg-[#D12C3B]/10 px-3 py-1 text-xs text-[#E85A66]">
                  {selectedProject.category}
                </span>
              </div>

              <h3 className="font-heading text-2xl font-bold text-off-white md:text-3xl">{selectedProject.title}</h3>
              <div className="mt-4 space-y-2 text-sm text-off-white/75">
                <p>
                  <span className="font-semibold text-off-white">Cliente:</span> {selectedProject.client}
                </p>
                <p>
                  <span className="font-semibold text-off-white">Tipo:</span> {selectedProject.type}
                </p>
                <p>
                  <span className="font-semibold text-off-white">Formato:</span> {selectedProject.format}
                </p>
                {selectedProject.duration ? (
                  <p>
                    <span className="font-semibold text-off-white">Duración:</span> {selectedProject.duration}
                  </p>
                ) : null}
                <p>
                  <span className="font-semibold text-off-white">Plataforma:</span> {selectedProject.platform}
                </p>
              </div>

              <p className="mt-5 text-sm text-off-white/80 md:text-base">{selectedProject.description}</p>
              <p className="mt-4 text-xs text-[#E85A66] md:text-sm">
                {selectedProject.tags.map((tag) => `#${tag}`).join(' ')}
              </p>

              <div className="mt-auto flex flex-wrap gap-3 pt-7">
                <button
                  type="button"
                  onClick={() => handleCopyReference(selectedProject.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-sm text-off-white transition hover:border-[#D12C3B]/60"
                >
                  {copiedRef === selectedProject.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedRef === selectedProject.id ? 'Copiado' : `Copiar REF (${selectedProject.id})`}
                </button>
                {selectedProject.type === 'web' ? (
                  <a
                    href={selectedProject.siteUrl ?? 'https://instagram.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#D12C3B] bg-[#D12C3B] px-4 py-2 text-sm font-semibold text-off-white transition hover:bg-[#B51823]"
                  >
                    Visitar sitio
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <a
                    href={buildWhatsAppUrl(
                      `Hola, quiero informacion sobre el proyecto ${selectedProject.id}`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#D12C3B] bg-[#D12C3B] px-4 py-2 text-sm font-semibold text-off-white transition hover:bg-[#B51823]"
                  >
                    WhatsApp directo
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
