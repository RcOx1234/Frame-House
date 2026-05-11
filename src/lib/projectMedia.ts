import type { Project, ProjectMediaItem } from './projects';

/**
 * Media shown inside the project modal carousel.
 * - If `mediaItems` exists and has entries, only those are used (strict shape).
 * - Otherwise fallback uses preview assets; if none exist, uses thumbnail as last resort.
 *   Thumbnail should not be an extra slide when a real carousel exists.
 */
export function getProjectMediaItems(project: Project): ProjectMediaItem[] {
  if (Array.isArray(project.mediaItems) && project.mediaItems.length > 0) {
    return project.mediaItems
      .filter((item): item is ProjectMediaItem => Boolean(item && item.id && item.kind && item.url))
      .map((item) => ({
        id: item.id,
        kind: item.kind,
        url: item.url,
        label: item.label
      }));
  }

  const fallback: ProjectMediaItem[] = [];

  if (project.previewImage) {
    fallback.push({
      id: `${project.id}-preview-image`,
      kind: 'image',
      url: project.previewImage,
      label: 'Preview'
    });
  }

  if (project.previewVideo) {
    fallback.push({
      id: `${project.id}-preview-video`,
      kind: 'video',
      url: project.previewVideo,
      label: 'Video'
    });
  }

  if (fallback.length === 0 && project.thumbnail) {
    fallback.push({
      id: `${project.id}-thumb`,
      kind: 'image',
      url: project.thumbnail,
      label: 'Thumbnail'
    });
  }

  return fallback;
}
