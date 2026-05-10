import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Project } from '../lib/projects';
import { getProjectMediaItems } from '../lib/projectMedia';
import { ProjectMediaSlide } from './ProjectMediaSlide';

type Props = {
  project: Project;
};

export function ProjectMediaCarousel({ project }: Props) {
  const items = useMemo(() => getProjectMediaItems(project), [project]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [project.id]);

  const total = items.length;
  const hasMultiple = total > 1;
  const safeIndex = total === 0 ? 0 : Math.min(activeIndex, total - 1);
  const activeItem = items[safeIndex];

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  if (!activeItem) {
    return <div className="h-full w-full bg-black" />;
  }

  return (
    <div className="relative h-full w-full">
      <ProjectMediaSlide item={activeItem} title={project.title} className="h-full w-full object-cover" />

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-off-white/90 backdrop-blur-sm transition hover:text-[#D61E2B]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-off-white/90 backdrop-blur-sm transition hover:text-[#D61E2B]"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 right-3 z-10 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-xs text-off-white/85 backdrop-blur-sm">
            {safeIndex + 1} / {total}
          </div>
        </>
      ) : null}
    </div>
  );
}

