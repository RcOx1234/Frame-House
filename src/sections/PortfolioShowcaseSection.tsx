import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PortfolioImageLightbox, {
  type PortfolioSlide,
} from '../components/PortfolioImageLightbox';

const AUTO_INTERVAL_MS = 6000;
const SWIPE_THRESHOLD_PX = 48;

type Manifest = {
  pages: PortfolioSlide[];
};

export default function PortfolioShowcaseSection() {
  const navigate = useNavigate();
  const base = import.meta.env.BASE_URL;
  const manifestUrl = `${base}images/portfolio-frame-house/manifest.json`;

  const [slides, setSlides] = useState<PortfolioSlide[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const numPages = slides.length;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(manifestUrl);
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as Manifest;
        if (!cancelled && Array.isArray(data.pages) && data.pages.length > 0) {
          setSlides(
            data.pages.map((p) => ({
              ...p,
              src: p.src.startsWith('http') ? p.src : `${base}${p.src.replace(/^\//, '')}`,
            })),
          );
          setLoadError(false);
        }
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [base, manifestUrl]);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (numPages <= 0) return;
      setActive((i) => (i + dir + numPages) % numPages);
    },
    [numPages],
  );

  useEffect(() => {
    if (reducedMotion || paused || lightboxOpen || numPages === 0) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % numPages);
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, numPages, lightboxOpen]);

  useEffect(() => {
    if (numPages <= 0) return;
    setActive((i) => Math.min(i, numPages - 1));
  }, [numPages]);

  const scrollToFullPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const caption =
    numPages > 0 ? slides[active]?.caption ?? '' : 'Portafolio Frame House';

  return (
    <section
      id="portfolio-spotlight"
      className="section-flowing relative overflow-hidden bg-[#1A0A10] text-[#F4EDE4]"
    >
      <PortfolioImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        slides={slides}
        active={active}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(209, 44, 59, 0.08), transparent 55%), linear-gradient(180deg, #1A0A10 0%, #0D0508 100%)',
        }}
      />

      <div className="relative z-10 px-6 md:px-[7vw]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
          <div className="w-full shrink-0 lg:w-[35%] lg:max-w-xl">
            <p className="label-mono mb-4 text-[#F4EDE4]/70">Portfolio / trabajos reales</p>
            <h2 className="font-heading text-3xl font-bold uppercase leading-[1.05] tracking-[0.06em] text-white md:text-4xl lg:text-[2.35rem] xl:text-5xl">
              Mira nuestro portafolio
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#F4EDE4]/85 md:text-lg">
              Contenido real. Resultados visibles. Estética que vende.
            </p>
            <div className="mt-8 hidden flex-wrap gap-3 sm:flex">
              <button
                type="button"
                onClick={() => navigate('/plan-personalizado')}
                className="btn-primary rounded-2xl px-6 py-3 text-sm font-semibold tracking-wide"
              >
                Cotizar plan
              </button>
              <button
                type="button"
                onClick={scrollToFullPortfolio}
                className="rounded-2xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-[#F4EDE4] transition-colors hover:border-[#D12C3B]/50 hover:bg-white/10"
              >
                Ver proyectos
              </button>
            </div>
          </div>

          <div
            className="relative w-full min-w-0 lg:w-[65%]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current == null) return;
              const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
              const delta = endX - touchStartX.current;
              touchStartX.current = null;
              if (delta > SWIPE_THRESHOLD_PX) go(-1);
              else if (delta < -SWIPE_THRESHOLD_PX) go(1);
            }}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] border border-white/[0.12] bg-black/40 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.65)] md:aspect-[16/9]">
              <button
                type="button"
                className="absolute inset-0 z-[8] cursor-pointer bg-transparent p-0"
                aria-label="Abrir portafolio a pantalla completa"
                disabled={numPages <= 0}
                onClick={() => setLightboxOpen(true)}
              />

              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div className="absolute inset-0 z-[5] bg-black/20">
                {loadError && (
                  <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/70">
                    No se encontró el manifiesto del portafolio. Ejecutá{' '}
                    <code className="mx-1 rounded bg-white/10 px-1 font-mono text-xs">
                      npm run export:portfolio
                    </code>{' '}
                    o revisá{' '}
                    <span className="font-mono text-xs">public/images/portfolio-frame-house/</span>
                  </div>
                )}
                {!loadError && numPages === 0 && (
                  <div className="flex h-full items-center justify-center text-sm text-white/60">
                    Cargando portafolio…
                  </div>
                )}
                {slides.map((slide, i) => (
                  <img
                    key={slide.src}
                    src={slide.src}
                    alt={slide.caption}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-out ${
                      i === active ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                  />
                ))}
              </div>

              <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 p-4 md:p-6">
                <p className="font-heading text-sm font-semibold tracking-wide text-white/95 md:text-base">
                  {caption}
                </p>
              </div>

              <button
                type="button"
                aria-label="Anterior"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors hover:border-[#D12C3B]/60 hover:text-[#FF4D5C] md:left-4 md:h-11 md:w-11"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Siguiente"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors hover:border-[#D12C3B]/60 hover:text-[#FF4D5C] md:right-4 md:h-11 md:w-11"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {numPages > 0 &&
                slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Ir a página ${i + 1}`}
                    aria-current={i === active}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(i);
                    }}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === active ? 'w-8 bg-[#D12C3B]' : 'w-2 bg-white/25 hover:bg-white/40'
                    }`}
                  />
                ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 sm:hidden">
              <button
                type="button"
                onClick={() => navigate('/plan-personalizado')}
                className="btn-primary flex-1 rounded-2xl py-3 text-sm font-semibold"
              >
                Cotizar plan
              </button>
              <button
                type="button"
                onClick={scrollToFullPortfolio}
                className="flex-1 rounded-2xl border border-white/25 bg-white/5 py-3 text-sm font-medium text-[#F4EDE4]"
              >
                Ver proyectos
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
