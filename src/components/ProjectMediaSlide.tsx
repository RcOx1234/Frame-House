import type { ProjectMediaItem } from '../lib/projects';
import { useEffect, useRef, useState } from 'react';

type Props = {
  item: ProjectMediaItem;
  title: string;
  className?: string;
  preferSound?: boolean;
};

export function ProjectMediaSlide({ item, title, className, preferSound = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(!preferSound);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setMuted(!preferSound);
    setImageFailed(false);
  }, [item.url, item.kind, preferSound]);

  const baseClassName = className ?? 'h-full w-full object-cover';

  if (item.kind === 'video') {
    return (
      <video
        key={item.url}
        ref={videoRef}
        src={item.url}
        controls
        autoPlay
        muted={muted}
        playsInline
        onLoadedData={async () => {
          const el = videoRef.current;
          if (!el) return;

          if (!preferSound) return;

          try {
            el.muted = false;
            el.volume = 1;
            await el.play();
            setMuted(false);
          } catch {
            try {
              el.muted = true;
              setMuted(true);
              await el.play();
            } catch {
              // ignore
            }
          }
        }}
        className={baseClassName}
      />
    );
  }

  if (imageFailed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black">
        <span className="text-xs text-off-white/70">No se pudo cargar la imagen</span>
      </div>
    );
  }

  return (
    <img
      key={item.url}
      src={item.url}
      alt={item.label ?? title}
      onError={() => setImageFailed(true)}
      className={baseClassName}
      loading="eager"
      decoding="async"
    />
  );
}
