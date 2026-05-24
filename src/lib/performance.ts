const MOBILE_MAX_WIDTH = 767

export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches
}

/** Scale particle/effect counts down on mobile (~2/3). */
export function scaleParticleCount(count: number): number {
  if (!isMobileViewport()) return count
  return Math.max(1, Math.round(count * (2 / 3)))
}

/** Cap canvas backing-store scale on high-DPR phones to reduce fill cost. */
export function getCanvasDpr(): number {
  const dpr = window.devicePixelRatio || 1
  return Math.min(dpr, isMobileViewport() ? 1.5 : 2)
}
