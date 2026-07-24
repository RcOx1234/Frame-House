import type { ProjectMediaItem } from '../lib/projects';
import { useRef, useState } from 'react';

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
  const [slideKey, setSlideKey] = useState(`${item.url}:${item.kind}:${preferSound}`);
  const nextSlideKey = `${item.url}:${item.kind}:${preferSound}`;

  if (slideKey !== nextSlideKey) {
    setSlideKey(nextSlideKey);
    setMuted(!preferSound);
    setImageFailed(false);
  }

  const baseClassName = className ?? 'h-full w-full object-cover';

  if (item.kind === 'video') {
    const isContain = item.displayMode === 'contain';
    const video = (
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
        className={isContain ? 'relative z-10 h-full w-full object-contain' : baseClassName}
      />
    );

    if (isContain) {
      return (
        <div className="relative h-full w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-[linear-gradient(155deg,#0B0D10_0%,#12070A_42%,#09090B_72%,#0B0D10_100%)]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_22%_18%,rgba(209,44,59,0.14),transparent_48%),radial-gradient(ellipse_at_78%_82%,rgba(177,24,35,0.1),transparent_44%)]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.45)_100%)]"
            aria-hidden
          />
          {video}
        </div>
      );
    }

    return video;
  }

  if (imageFailed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black">
        <span className="text-xs text-off-white/70">No se pudo cargar la imagen</span>
      </div>
    );
  }

  if (item.displayMode === 'contain') {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img
          key={`${item.url}-bg`}
          src={item.url}
          alt=""
          aria-hidden
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-55 blur-3xl saturate-75"
          loading="eager"
          decoding="async"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[rgba(11,13,16,0.42)] to-[rgba(18,7,10,0.62)]"
          aria-hidden
        />
        <img
          key={item.url}
          src={item.url}
          alt={item.label ?? title}
          onError={() => setImageFailed(true)}
          className="relative z-10 h-full w-full object-contain"
          loading="eager"
          decoding="async"
        />
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
