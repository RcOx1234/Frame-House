import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Check, Copy, ExternalLink, Globe, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster, toast } from 'sonner';
import { shouldUseLightAnimations } from '../lib/motion';

type ProjectType = 'video' | 'web' | 'social' | 'branding' | 'fotografia' | 'otros';
type FilterType = 'Todos' | 'Videos' | 'Webs' | 'Contenido Social' | 'Branding / Diseño' | 'Fotografía' | 'Otros';

type Project = {
  id: string;
  title: string;
  client: string;
  type: ProjectType;
  category: FilterType;
  thumbnail: string;
  previewVideo?: string;
  duration?: string;
  platform: string;
  description: string;
  tags: string[];
  format: string;
  siteUrl?: string;
  featured?: boolean;
};

const WHATSAPP_NUMBER = '593991433792';
const FILTERS: FilterType[] = ['Todos', 'Videos', 'Webs', 'Contenido Social', 'Branding / Diseño', 'Fotografía', 'Otros'];
gsap.registerPlugin(ScrollTrigger);

const PROJECTS: Project[] = [
  {
    id: 'FH-VID-023',
    title: 'Campaña Ojos Asi',
    client: 'Shakira Team',
    type: 'video',
    category: 'Videos',
    thumbnail: 'https://billboard.com.co/wp-content/uploads/2025/07/ojos-asi-770x470.png',
    previewVideo: 'https://res.cloudinary.com/dolxglacq/video/upload/q_auto/f_auto/v1776644599/Ojos-asi_avh7b2.mp4',
    duration: '00:30',
    platform: 'Instagram / Reels',
    description: 'Pieza short-form para awareness y retencion, optimizada para hook en 3 segundos.',
    tags: ['performance', 'shortform', 'ads'],
    format: 'Reel Ad',
    featured: true
  },
  {
    id: 'FH-VID-024',
    title: 'Bolones Picapiedra Prom',
    client: 'Bolones Picapiedra',
    type: 'video',
    category: 'Videos',
    thumbnail: 'https://ik.imagekit.io/ObamaRS12/Frame%20House/Portafolio/Galeria/ese.jpg',
    previewVideo: 'https://res.cloudinary.com/dolxglacq/video/upload/q_auto/f_auto/v1776649769/Video_Prom_2_cdxhzd.mp4',
    duration: '00:22',
    platform: 'TikTok / Instagram',
    description: 'Video promocional enfocado en conversion local con narrativa rapida y CTA visible.',
    tags: ['food', 'local', 'conversion'],
    format: 'Reel Promo'
  },
  {
    id: 'FH-WEB-011',
    title: 'Landing Performance B2B',
    client: 'Constructora Nova',
    type: 'web',
    category: 'Webs',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop',
    platform: 'Web',
    description: 'Landing page para captacion de leads con estructura de conversion y formulario optimizado.',
    tags: ['landing', 'ux', 'conversion'],
    format: 'Landing Page',
    siteUrl: 'https://instagram.com',
    featured: true
  },
  {
    id: 'FH-SOC-030',
    title: 'Contenido Mensual Fitness',
    client: 'Nova Gym',
    type: 'social',
    category: 'Contenido Social',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&auto=format&fit=crop',
    platform: 'Instagram',
    description: 'Sistema mensual de piezas para retencion y captacion con consistencia visual de marca.',
    tags: ['social', 'growth', 'content'],
    format: 'Content Pack'
  },
  {
    id: 'FH-DES-004',
    title: 'Rebranding Cafeteria Artesanal',
    client: 'Origen Coffee',
    type: 'branding',
    category: 'Branding / Diseño',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&auto=format&fit=crop',
    platform: 'Brand Assets',
    description: 'Rediseño de identidad visual, paleta, tipografia y sistema de piezas aplicadas.',
    tags: ['branding', 'identity', 'design'],
    format: 'Branding Kit'
  },
  {
    id: 'FH-FOT-017',
    title: 'Album Editorial Moda',
    client: 'Atelier 92',
    type: 'fotografia',
    category: 'Fotografía',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop',
    platform: 'Editorial',
    description: 'Sesion fotografica enfocada en textura de prendas, colorimetria y direccion de arte.',
    tags: ['photo', 'editorial', 'fashion'],
    format: 'Photo Album'
  },
  {
    id: 'FH-OTH-010',
    title: 'Cobertura Evento Corporativo',
    client: 'Summit Pro',
    type: 'otros',
    category: 'Otros',
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop',
    platform: 'Multiplataforma',
    description: 'Cobertura integral: clips, fotografias y resumen ejecutivo para comunicacion interna.',
    tags: ['event', 'coverage', 'corporate'],
    format: 'Event Pack'
  },
  {
    id: 'FH-WEB-012',
    title: 'Sitio Portfolio Arquitectura',
    client: 'Linea Vertical',
    type: 'web',
    category: 'Webs',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&auto=format&fit=crop',
    platform: 'Web',
    description: 'Sitio de alto impacto visual para mostrar proyectos y facilitar contacto comercial.',
    tags: ['portfolio', 'web', 'uxui'],
    format: 'Website',
    siteUrl: 'https://instagram.com'
  },
  {
    id: 'FH-WEB-013',
    title: 'Cafeteria Verde & Cafe',
    client: 'Cafeteria Verde & Cafe',
    type: 'web',
    category: 'Webs',
    thumbnail: 'https://ik.imagekit.io/ObamaRS12/Frame%20House/Portafolio/Galeria/logo_verde-y-cafe3.jpg?updatedAt=1777500506231',
    platform: 'Web',
    description:
      'Sitio web con enfoque en marca local, menu destacado y experiencia visual calida para convertir visitas en pedidos.',
    tags: ['react', 'web', 'branding', 'local-business', 'ux'],
    format: 'Website',
    siteUrl: 'https://verde-cafe-manta.vercel.app/'
  }
];

function typeIcon(type: ProjectType) {
  if (type === 'video' || type === 'social') return <Play className="w-4 h-4" />;
  if (type === 'web') return <Globe className="w-4 h-4" />;
  return <Camera className="w-4 h-4" />;
}

export default function TrabajosPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');
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

  const filteredProjects = useMemo(() => {
    const ranked = [...PROJECTS].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    if (activeFilter === 'Todos') return ranked;
    return ranked.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredProjects.length;

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
    const lightAnimations = shouldUseLightAnimations();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: lightAnimations ? 0.35 : 0.55, ease: 'power2.out' }
      );

      gsap.fromTo(
        filtersRef.current,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: lightAnimations ? 0.28 : 0.45,
          delay: 0.08,
          ease: 'power2.out'
        }
      );

      const cards = Array.from(grid.querySelectorAll('button'));
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: lightAnimations ? 0.28 : 0.45,
            stagger: lightAnimations ? 0.03 : 0.05,
            ease: 'power2.out',
            clearProps: 'all'
          }
        );
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
  }, []);

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

    const cards = Array.from(grid.querySelectorAll('button'));
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
    if (!grid) return;
    if (!hasMountedRef.current) return;

    gsap.fromTo(
      grid,
      { opacity: 0.45 },
      { opacity: 1, duration: 0.2, ease: 'power1.out', clearProps: 'opacity' }
    );
  }, [activeFilter]);

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

  return (
    <div
      ref={pageRef}
      className={`relative min-h-screen bg-[#0B0D10] text-off-white transition-opacity duration-300 ${pageVisible ? 'opacity-100' : 'opacity-0'}`}
    >
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

      <main className="px-6 py-12 md:px-[7vw] md:py-16">
        <header ref={headerRef} className="max-w-4xl">
          <p className="font-mono text-xs tracking-[0.35em] text-[#D61E2B] md:text-sm">PORTFOLIO</p>
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-off-white md:text-5xl">
            TRABAJOS QUE GENERAN RESULTADOS.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-off-white/70 md:text-lg">
            Explora proyectos reales: contenido, sitios web, campanas y mas.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-[#D61E2B]/45 bg-[#0A0A0A] px-4 py-2 text-sm text-off-white/90">
              +120 proyectos
            </span>
            <span className="rounded-full border border-white/15 bg-[#0A0A0A] px-4 py-2 text-sm text-off-white/90">
              +35 marcas
            </span>
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 text-sm text-off-white/70 transition-colors hover:text-off-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </header>

        <section ref={filtersRef} className="mt-10 flex flex-wrap gap-3 md:mt-12">
          {FILTERS.map((filter) => {
            const active = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm transition-all md:text-base ${
                  active
                    ? 'border-[#D61E2B] bg-[#D61E2B]/15 text-off-white'
                    : 'border-white/15 bg-[#0A0A0A] text-off-white/70 hover:border-[#D61E2B]/50 hover:text-off-white'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </section>

        <section ref={gridRef} className="mt-8 grid grid-cols-1 gap-5 md:mt-10 md:grid-cols-2 xl:grid-cols-4">
          {visibleProjects.map((project) => (
            <button
              type="button"
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] text-left shadow-[0_24px_60px_rgba(0,0,0,0.45)] ${
                project.featured ? 'md:col-span-2' : ''
              }`}
            >
              <div className="relative h-64 md:h-72">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                ) : null}

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition-all duration-500 group-hover:backdrop-blur-[2px]" />
              </div>

              <div className="absolute inset-0 z-10 flex flex-col justify-between p-5">
                <div className="flex items-start justify-between">
                  <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs text-off-white/90">
                    {project.client}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs text-off-white/90">
                    {typeIcon(project.type)}
                    {project.type}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading text-xl font-bold tracking-wide text-off-white md:text-2xl">{project.title}</h3>
                  <p className="mt-1 text-sm text-off-white/75">{project.format}</p>
                </div>
              </div>
            </button>
          ))}
        </section>

        {canLoadMore ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="inline-flex items-center gap-2 rounded-full border border-[#D61E2B]/60 bg-[#D61E2B]/15 px-5 py-2.5 text-sm font-medium text-off-white transition hover:bg-[#D61E2B]/25"
            >
              Cargar mas
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        <section ref={ctaRef} className="mt-16 rounded-3xl border border-[#D61E2B]/30 bg-[#0A0A0A] p-7 md:mt-20 md:p-10">
          <h2 className="font-heading text-2xl font-bold text-off-white md:text-4xl">Quieres resultados como estos?</h2>
          <p className="mt-3 max-w-2xl text-sm text-off-white/70 md:text-base">
            Cuentanos tu objetivo y te proponemos la estrategia ideal para tu marca.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/#plans"
              className="rounded-full border border-[#D61E2B] bg-[#D61E2B] px-5 py-2.5 text-sm font-semibold text-off-white transition hover:bg-[#B51823]"
            >
              Cotizar
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20quiero%20cotizar%20un%20proyecto%20con%20Frame%20House`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-off-white transition hover:border-[#D61E2B]/60 hover:text-[#D61E2B]"
            >
              WhatsApp directo
            </a>
          </div>
        </section>
      </main>

      {selectedProject ? (
        <div
          ref={modalOverlayRef}
          className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/80 p-4 pt-8 backdrop-blur-sm md:items-center md:p-8"
          onClick={closeModal}
        >
          <div
            ref={modalPanelRef}
            className="relative grid w-full max-w-6xl overflow-hidden rounded-[24px] border border-white/10 bg-[#0A0A0A] shadow-[0_40px_100px_rgba(0,0,0,0.65)] md:max-h-[90vh] lg:grid-cols-[1.2fr_0.8fr]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-black/40 p-2 text-off-white/90 transition hover:text-[#D61E2B]"
              aria-label="Cerrar modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative min-h-[240px] bg-black md:min-h-[320px] lg:min-h-0">
              {selectedProject.previewVideo ? (
                <video
                  src={selectedProject.previewVideo}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img src={selectedProject.thumbnail} alt={selectedProject.title} className="h-full w-full object-cover" />
              )}
            </div>

            <div className="flex flex-col overflow-y-auto p-6 md:p-8">
              <h3 className="font-heading text-2xl font-bold text-off-white md:text-3xl">{selectedProject.title}</h3>
              <div className="mt-4 space-y-2 text-sm text-off-white/75">
                <p>
                  <span className="text-off-white">Cliente:</span> {selectedProject.client}
                </p>
                <p>
                  <span className="text-off-white">Tipo:</span> {selectedProject.type}
                </p>
                <p>
                  <span className="text-off-white">Formato:</span> {selectedProject.format}
                </p>
                {selectedProject.duration ? (
                  <p>
                    <span className="text-off-white">Duracion:</span> {selectedProject.duration}
                  </p>
                ) : null}
                <p>
                  <span className="text-off-white">Plataforma:</span> {selectedProject.platform}
                </p>
              </div>

              <p className="mt-5 text-sm text-off-white/80 md:text-base">{selectedProject.description}</p>
              <p className="mt-4 text-xs text-[#D61E2B] md:text-sm">
                {selectedProject.tags.map((tag) => `#${tag}`).join(' ')}
              </p>

              <div className="mt-auto flex flex-wrap gap-3 pt-7">
                <button
                  type="button"
                  onClick={() => handleCopyReference(selectedProject.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-sm text-off-white transition hover:border-[#D61E2B]/60"
                >
                  {copiedRef === selectedProject.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedRef === selectedProject.id ? 'Copiado' : `Copiar REF (${selectedProject.id})`}
                </button>
                {selectedProject.type === 'web' ? (
                  <a
                    href={selectedProject.siteUrl ?? 'https://instagram.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#D61E2B] bg-[#D61E2B] px-4 py-2 text-sm font-semibold text-off-white transition hover:bg-[#B51823]"
                  >
                    Visitar sitio
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hola, quiero informacion sobre el proyecto ${selectedProject.id}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#D61E2B] bg-[#D61E2B] px-4 py-2 text-sm font-semibold text-off-white transition hover:bg-[#B51823]"
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
