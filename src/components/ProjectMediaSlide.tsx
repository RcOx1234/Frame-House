import type { ProjectMediaItem } from '../lib/projects';

type Props = {
  item: ProjectMediaItem;
  title: string;
  className?: string;
};

export function ProjectMediaSlide({ item, title, className }: Props) {
  if (item.kind === 'video') {
    return (
      <video
        src={item.url}
        controls
        autoPlay
        muted
        playsInline
        className={className ?? 'h-full w-full object-cover'}
      />
    );
  }

  return <img src={item.url} alt={item.label ?? title} className={className ?? 'h-full w-full object-cover'} />;
}

