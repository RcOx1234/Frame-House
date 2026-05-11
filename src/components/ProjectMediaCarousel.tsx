import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Project } from '../lib/projects';
import { getProjectMediaItems } from '../lib/projectMedia';
import { ProjectMediaSlide } from './ProjectMediaSlide';

type Props = {
  project: Project;
};

type SlideFrame = {
  index: number;
  key: number;
};

const CROSSFADE_MS = 140;

/**
 * New slide sits above the previous one and fades in so the crossfade is actually visible.
 * Reflow between opacity and transition avoids transitions being skipped in some frames.
 */
function EnteringSlideShell({
  runEnter,
  children
}: {
  runEnter: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!runEnter) {
      el.style.opacity = '';
      el.style.transform = '';
      el.style.transition = '';
      return;
    }

    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'scale(1.02)';
    void el.offsetHeight;
    el.style.transition = `opacity ${CROSSFADE_MS}ms ease-out, transform ${CROSSFADE_MS}ms ease-out`;
    el.style.opacity = '1';
    el.style.transform = 'scale(1)';
  }, [runEnter]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-20 h-full w-full bg-black"
      style={runEnter ? { opacity: 0, transform: 'scale(1.02)' } : undefined}
    >
      {children}
    </div>
  );
}

type StackState = { top: SlideFrame; bottom: SlideFrame | null };

export function ProjectMediaCarousel({ project }: Props) {
  const items = useMemo(() => getProjectMediaItems(project), [project]);
  const keyRef = useRef(0);
  const transitionGenRef = useRef(0);

  const [stack, setStack] = useState<StackState>(() => ({
    top: { index: 0, key: ++keyRef.current },
    bottom: null
  }));

  useEffect(() => {
    keyRef.current = 0;
    transitionGenRef.current = 0;
    setStack({
      top: { index: 0, key: ++keyRef.current },
      bottom: null
    });
  }, [project.id]);

  const total = items.length;
  const hasMultiple = total > 1;

  useEffect(() => {
    if (total === 0) return;
    setStack((s) => {
      if (s.top.index < total) return s;
      return { ...s, top: { ...s.top, index: total - 1 } };
    });
  }, [total]);

  const safeTopIndex = total === 0 ? 0 : Math.min(stack.top.index, total - 1);
  const topItem = items[safeTopIndex];

  const scheduleClearBottom = useCallback(() => {
    const gen = ++transitionGenRef.current;
    window.setTimeout(() => {
      if (transitionGenRef.current !== gen) return;
      setStack((s) => (s.bottom ? { ...s, bottom: null } : s));
    }, CROSSFADE_MS + 35);
  }, []);

  const goNext = useCallback(() => {
    if (total <= 1) return;
    scheduleClearBottom();
    setStack((s) => ({
      bottom: s.top,
      top: { index: (s.top.index + 1) % total, key: ++keyRef.current }
    }));
  }, [scheduleClearBottom, total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    scheduleClearBottom();
    setStack((s) => ({
      bottom: s.top,
      top: { index: (s.top.index - 1 + total) % total, key: ++keyRef.current }
    }));
  }, [scheduleClearBottom, total]);

  if (!topItem) {
    return <div className="h-full w-full bg-black" />;
  }

  const bottomItem = stack.bottom ? items[stack.bottom.index] : null;
  const runEnter = Boolean(stack.bottom);

  return (
    <div className="relative h-full w-full">
      <div className="relative h-full w-full overflow-hidden bg-black">
        {stack.bottom && bottomItem ? (
          <div className="absolute inset-0 z-10 h-full w-full bg-black">
            <ProjectMediaSlide
              item={bottomItem}
              title={project.title}
              className="h-full w-full object-cover"
              preferSound={false}
            />
          </div>
        ) : null}

        <EnteringSlideShell key={stack.top.key} runEnter={runEnter}>
          <ProjectMediaSlide
            item={topItem}
            title={project.title}
            className="h-full w-full object-cover"
            preferSound
          />
        </EnteringSlideShell>
      </div>

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-off-white/90 backdrop-blur-sm transition hover:text-[#D61E2B]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-off-white/90 backdrop-blur-sm transition hover:text-[#D61E2B]"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 right-3 z-30 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-xs text-off-white/85 backdrop-blur-sm">
            {safeTopIndex + 1} / {total}
          </div>
        </>
      ) : null}
    </div>
  );
}
