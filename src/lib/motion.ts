export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isMobileViewport(maxWidth = 768): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= maxWidth;
}

export function shouldUseLightAnimations(): boolean {
  return prefersReducedMotion() || isMobileViewport();
}
