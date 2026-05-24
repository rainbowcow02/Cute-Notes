import { useEffect, useRef } from 'react'
import { getCanvasDpr, isMobileViewport, scaleParticleCount } from '../lib/performance'
import type { AnimationId } from '../types/note'
import blossom1 from '../../assets/cblossom-1.svg'
import blossom2 from '../../assets/cblossom-2.svg'
import blossom3 from '../../assets/cblossom-3.svg'
import duckCapSvg from '../../assets/duck-cap.svg'
import kyat1 from '../../assets/kyat-1.svg'
import kyat2 from '../../assets/kyat-2.svg'
import kyat3 from '../../assets/kyat-3.svg'
import starSvg from '../../assets/star.svg'

const BLOSSOM_SRCS = [blossom1, blossom2, blossom3]
const blossomImages: (HTMLImageElement | null)[] = [null, null, null]
const KYAT_SRCS = [kyat1, kyat2, kyat3]
const kyatImages: (HTMLImageElement | null)[] = [null, null, null]
let starImage: HTMLImageElement | null = null
let duckCapImage: HTMLImageElement | null = null
const SNOW_KYAT_CHANCE = 0.08

function loadImage(src: string, onLoad: (img: HTMLImageElement) => void) {
  const img = new Image()
  img.src = src
  img.onload = () => onLoad(img)
}

function loadBlossomImages() {
  BLOSSOM_SRCS.forEach((src, i) => {
    if (blossomImages[i]) return
    loadImage(src, (img) => {
      blossomImages[i] = img
    })
  })
}

function loadStarImage() {
  if (starImage) return
  loadImage(starSvg, (img) => {
    starImage = img
  })
}

function loadDuckCapImage() {
  if (duckCapImage) return
  loadImage(duckCapSvg, (img) => {
    duckCapImage = img
  })
}

function loadKyatImages() {
  KYAT_SRCS.forEach((src, i) => {
    if (kyatImages[i]) return
    loadImage(src, (img) => {
      kyatImages[i] = img
    })
  })
}

loadBlossomImages()
loadStarImage()
loadDuckCapImage()
loadKyatImages()

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  rotation: number
  vr: number
  hue?: number
  sprite?: number
  shape: 'circle' | 'star' | 'petal' | 'leaf' | 'rect' | 'kyat'
  life?: number
  maxLife?: number
  gravity?: number
  baseY?: number
  direction?: number
  pathOffset?: number
  pathSpeed?: number
  waveAmpY?: number
  waveFreqY?: number
  waveAmpX?: number
  waveFreqX?: number
}

type ConfettiOrigin =
  | 'left'
  | 'right'
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

interface ConfettiPop {
  framesUntil: number
  origin: ConfettiOrigin
}

interface ConfettiState {
  scheduled: ConfettiPop[]
}

const CONFETTI_ORIGINS: ConfettiOrigin[] = [
  'left',
  'right',
  'top',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
]

interface ParticleCanvasProps {
  animationId: AnimationId
  active?: boolean
  className?: string
}

const COUNT = 48
const STAR_COUNT = 10
const CHERRY_BLOSSOM_COUNT = 12
const DUCK_COUNT = 5

function getParticleCount(id: AnimationId): number {
  if (id === 'stars') return scaleParticleCount(STAR_COUNT)
  if (id === 'cherry-blossoms') return scaleParticleCount(CHERRY_BLOSSOM_COUNT)
  if (id === 'ducks') return scaleParticleCount(DUCK_COUNT)
  if (id === 'rainbow-confetti') return 0
  return scaleParticleCount(COUNT)
}

function pickConfettiOrigin(exclude: ConfettiOrigin[] = []): ConfettiOrigin {
  const pool = exclude.length
    ? CONFETTI_ORIGINS.filter((origin) => !exclude.includes(origin))
    : CONFETTI_ORIGINS
  return pool[Math.floor(Math.random() * pool.length)] ?? CONFETTI_ORIGINS[0]
}

function scheduleConfettiBatch(): ConfettiPop[] {
  const baseDelay = Math.floor(randomBetween(95, 205))
  const origin1 = pickConfettiOrigin()
  const pops: ConfettiPop[] = [{ framesUntil: baseDelay, origin: origin1 }]

  if (Math.random() < 0.34) {
    pops.push({
      framesUntil: baseDelay + Math.floor(randomBetween(0, 16)),
      origin: pickConfettiOrigin([origin1]),
    })
  }

  return pops
}

function createConfettiState(): ConfettiState {
  return { scheduled: scheduleConfettiBatch() }
}

function getConfettiSpawn(w: number, h: number, origin: ConfettiOrigin): { x: number; y: number; angleMin: number; angleMax: number } {
  switch (origin) {
    case 'left':
      return {
        x: 0,
        y: randomBetween(h * 0.32, h * 0.68),
        angleMin: -Math.PI / 4,
        angleMax: Math.PI / 2.6,
      }
    case 'right':
      return {
        x: w,
        y: randomBetween(h * 0.32, h * 0.68),
        angleMin: (Math.PI * 5) / 6,
        angleMax: (Math.PI * 7) / 6,
      }
    case 'top':
      return {
        x: randomBetween(w * 0.28, w * 0.72),
        y: 0,
        angleMin: Math.PI / 5,
        angleMax: (Math.PI * 4) / 5,
      }
    case 'top-left':
      return {
        x: randomBetween(0, w * 0.14),
        y: randomBetween(0, h * 0.16),
        angleMin: Math.PI / 8,
        angleMax: Math.PI / 2.1,
      }
    case 'top-right':
      return {
        x: randomBetween(w * 0.86, w),
        y: randomBetween(0, h * 0.16),
        angleMin: Math.PI / 2.1,
        angleMax: Math.PI * 0.94,
      }
    case 'bottom-left':
      return {
        x: randomBetween(0, w * 0.14),
        y: randomBetween(h * 0.84, h),
        angleMin: -Math.PI / 2.2,
        angleMax: -Math.PI / 8,
      }
    case 'bottom-right':
      return {
        x: randomBetween(w * 0.86, w),
        y: randomBetween(h * 0.84, h),
        angleMin: -Math.PI * 0.78,
        angleMax: -Math.PI / 2.15,
      }
  }
}

function createConfettiBurstParticle(w: number, h: number, origin: ConfettiOrigin): Particle {
  const spawn = getConfettiSpawn(w, h, origin)
  const angle = randomBetween(spawn.angleMin, spawn.angleMax)
  const speed = randomBetween(5.5, 11)

  return {
    x: spawn.x + randomBetween(-10, 10),
    y: spawn.y + randomBetween(-10, 10),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - randomBetween(0.5, 2.5),
    size: randomBetween(5, 10),
    opacity: 1,
    rotation: randomBetween(0, Math.PI * 2),
    vr: randomBetween(-0.18, 0.18),
    hue: randomBetween(0, 360),
    shape: 'rect',
    life: 0,
    maxLife: Math.floor(randomBetween(90, 150)),
    gravity: randomBetween(0.09, 0.15),
  }
}

function spawnConfettiBurst(particles: Particle[], w: number, h: number, origin: ConfettiOrigin) {
  const min = isMobileViewport() ? 12 : 18
  const max = isMobileViewport() ? 20 : 30
  const count = Math.floor(randomBetween(min, max))
  for (let i = 0; i < count; i++) {
    particles.push(createConfettiBurstParticle(w, h, origin))
  }
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function createDuckParticle(w: number, h: number, laneIndex?: number): Particle {
  const duckCount = scaleParticleCount(DUCK_COUNT)
  const lane = laneIndex ?? Math.floor(randomBetween(0, duckCount))
  const direction = Math.random() < 0.5 ? -1 : 1
  const laneY =
    h * (0.34 + (lane / Math.max(1, duckCount - 1)) * 0.38) + randomBetween(-6, 6)

  return {
    x: direction > 0 ? randomBetween(-w * 0.2, w * 0.45) : randomBetween(w * 0.55, w * 1.2),
    y: laneY,
    baseY: laneY,
    vx: direction * randomBetween(0.08, 0.2),
    vy: 0,
    size: randomBetween(34, 50),
    opacity: randomBetween(0.88, 1),
    rotation: 0,
    vr: 0,
    shape: 'circle',
    sprite: lane,
    direction,
    life: randomBetween(0, Math.PI * 2),
    pathOffset: randomBetween(0, Math.PI * 2),
    pathSpeed: randomBetween(0.008, 0.016),
    waveAmpY: randomBetween(5, 16),
    waveFreqY: randomBetween(0.3, 0.75),
    waveAmpX: randomBetween(0.05, 0.16),
    waveFreqX: randomBetween(0.2, 0.6),
  }
}

function createParticle(w: number, h: number, id: AnimationId): Particle {
  const base: Particle = {
    x: randomBetween(0, w),
    y: randomBetween(-h * 0.2, h),
    vx: 0,
    vy: 0,
    size: randomBetween(2, 6),
    opacity: randomBetween(0.3, 0.9),
    rotation: randomBetween(0, Math.PI * 2),
    vr: randomBetween(-0.02, 0.02),
    shape: 'circle',
  }

  switch (id) {
    case 'snow': {
      if (Math.random() < SNOW_KYAT_CHANCE) {
        return {
          ...base,
          shape: 'kyat',
          sprite: Math.floor(Math.random() * KYAT_SRCS.length),
          vy: randomBetween(0.55, 1.45),
          vx: randomBetween(-0.35, 0.35),
          size: randomBetween(72, 96),
          opacity: randomBetween(0.85, 1),
          vr: randomBetween(-0.015, 0.015),
        }
      }
      return {
        ...base,
        vy: randomBetween(0.3, 1.2),
        vx: randomBetween(-0.3, 0.3),
        size: randomBetween(2.5, 6),
        opacity: randomBetween(0.65, 1),
      }
    }
    case 'stars': {
      const vy = randomBetween(0.5, 2.0)
      const vx = randomBetween(-1.1, 1.1)
      return {
        ...base,
        x: randomBetween(-w * 0.1, w * 1.1),
        y: randomBetween(-h * 0.4, -10),
        shape: 'star',
        vx,
        vy,
        size: randomBetween(12, 32),
        opacity: randomBetween(0.55, 1),
        rotation: Math.atan2(vy, vx) + Math.PI / 2,
        vr: randomBetween(-0.008, 0.008),
      }
    }
    case 'cherry-blossoms':
      return {
        ...base,
        shape: 'petal',
        sprite: Math.floor(Math.random() * BLOSSOM_SRCS.length),
        vy: randomBetween(0.4, 1),
        vx: randomBetween(-0.8, 0.8),
        size: randomBetween(14, 24),
        vr: randomBetween(-0.04, 0.04),
      }
    case 'rainbow-confetti':
      return createConfettiBurstParticle(w, h, pickConfettiOrigin())
    case 'fireflies':
      return { ...base, vy: randomBetween(-0.3, 0.3), vx: randomBetween(-0.4, 0.4), size: randomBetween(2, 4), opacity: randomBetween(0.1, 0.8), life: randomBetween(0, 100) }
    case 'leaves':
      return { ...base, shape: 'leaf', vy: randomBetween(0.5, 1.5), vx: randomBetween(-0.6, 0.6), size: randomBetween(8, 14), hue: randomBetween(70, 130) }
    case 'sparkles':
      return { ...base, shape: 'star', vy: randomBetween(-0.2, 0.2), vx: randomBetween(-0.2, 0.2), size: randomBetween(2, 5), opacity: randomBetween(0, 1) }
    case 'ducks':
      return createDuckParticle(w, h)
    default:
      return base
  }
}

function drawSnowParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.globalAlpha = p.opacity

  if (p.shape === 'kyat') {
    const img = kyatImages[p.sprite ?? 0]
    if (img) {
      const aspect = img.naturalHeight / img.naturalWidth
      const w = p.size
      const h = p.size * aspect
      ctx.shadowColor = 'rgba(90, 100, 110, 0.22)'
      ctx.shadowBlur = Math.max(2, w * 0.12)
      ctx.drawImage(img, -w / 2, -h / 2, w, h)
      ctx.restore()
      return
    }
  }

  const r = p.size

  // Soft neutral shadow keeps flakes visible on light surfaces without a blue bubble look.
  ctx.shadowColor = 'rgba(90, 100, 110, 0.22)'
  ctx.shadowBlur = Math.max(1.5, r * 0.45)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fill()

  ctx.shadowBlur = 0
  ctx.strokeStyle = 'rgba(130, 140, 150, 0.28)'
  ctx.lineWidth = Math.max(0.4, r * 0.16)
  ctx.stroke()

  ctx.restore()
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, id: AnimationId) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.globalAlpha = p.opacity

  if (id === 'cherry-blossoms') {
    const img = blossomImages[p.sprite ?? 0]
    if (img) {
      const aspect = img.naturalHeight / img.naturalWidth
      const w = p.size
      const h = p.size * aspect
      ctx.drawImage(img, -w / 2, -h / 2, w, h)
      ctx.restore()
      return
    }
  }

  if (id === 'stars' && starImage) {
    const aspect = starImage.naturalHeight / starImage.naturalWidth
    const w = p.size
    const h = p.size * aspect
    ctx.drawImage(starImage, -w / 2, -h / 2, w, h)
    ctx.restore()
    return
  }

  if (id === 'ducks' && duckCapImage) {
    const aspect = duckCapImage.naturalHeight / duckCapImage.naturalWidth
    const w = p.size
    const h = p.size * aspect
    if ((p.direction ?? p.vx) < 0) ctx.scale(-1, 1)
    ctx.drawImage(duckCapImage, -w / 2, -h / 2, w, h)
    ctx.restore()
    return
  }

  if (id === 'snow') {
    ctx.restore()
    drawSnowParticle(ctx, p)
    return
  }

  if (id === 'rainbow-confetti' && p.hue !== undefined) {
    ctx.fillStyle = `hsl(${p.hue}, 85%, 60%)`
  } else if (id === 'leaves' && p.hue !== undefined) {
    ctx.fillStyle = `hsl(${p.hue}, 45%, 45%)`
  } else if (id === 'fireflies') {
    ctx.fillStyle = 'rgba(255, 230, 120, 0.9)'
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
  }

  if (p.shape === 'star') {
    const r = p.size
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
      const method = i === 0 ? 'moveTo' : 'lineTo'
      ctx[method](Math.cos(angle) * r, Math.sin(angle) * r)
    }
    ctx.closePath()
    ctx.fill()
  } else if (p.shape === 'petal') {
    ctx.beginPath()
    ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2)
    ctx.fill()
  } else if (p.shape === 'leaf') {
    ctx.beginPath()
    ctx.ellipse(0, 0, p.size * 0.35, p.size * 0.6, 0, 0, Math.PI * 2)
    ctx.fill()
  } else if (p.shape === 'rect') {
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
  } else {
    ctx.beginPath()
    ctx.arc(0, 0, p.size, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

export function ParticleCanvas({ animationId, active = true, className }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const confettiStateRef = useRef<ConfettiState>(createConfettiState())
  const frameRef = useRef<number>(0)
  const activeRef = useRef(active)
  const syncLoopRef = useRef<(() => void) | null>(null)

  activeRef.current = active

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = getCanvasDpr()

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      dpr = getCanvasDpr()
      const { width, height } = parent.getBoundingClientRect()
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particlesRef.current =
        animationId === 'ducks'
          ? Array.from({ length: getParticleCount('ducks') }, (_, i) => {
              const duckCount = getParticleCount('ducks')
              const duck = createDuckParticle(width, height, i)
              duck.x = ((i + 0.5) / duckCount) * width + randomBetween(-24, 24)
              return duck
            })
          : Array.from({ length: getParticleCount(animationId) }, () =>
              createParticle(width, height, animationId),
            )
      if (animationId === 'rainbow-confetti') {
        confettiStateRef.current = createConfettiState()
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const shouldRun = () => activeRef.current && document.visibilityState === 'visible'

    const stopLoop = () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = 0
      }
    }

    const tick = () => {
      if (!shouldRun()) {
        frameRef.current = 0
        return
      }

      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)

      if (animationId === 'rainbow-confetti') {
        const confetti = confettiStateRef.current
        confetti.scheduled = confetti.scheduled.filter((pop) => {
          pop.framesUntil -= 1
          if (pop.framesUntil > 0) return true
          spawnConfettiBurst(particlesRef.current, w, h, pop.origin)
          return false
        })
        if (confetti.scheduled.length === 0) {
          confetti.scheduled = scheduleConfettiBatch()
        }

        particlesRef.current = particlesRef.current.filter((p) => {
          p.life = (p.life ?? 0) + 1
          p.vy += p.gravity ?? 0.12
          p.vx *= 0.992
          p.x += p.vx
          p.y += p.vy
          p.rotation += p.vr
          const maxLife = p.maxLife ?? 120
          p.opacity = Math.max(0, 1 - (p.life / maxLife) ** 1.4)

          if (p.life >= maxLife) return false
          if (p.y > h + 30 || p.y < -40 || p.x < -40 || p.x > w + 40) return false

          drawParticle(ctx, p, animationId)
          return true
        })
      } else {
        particlesRef.current.forEach((p) => {
        if (animationId === 'ducks') {
          p.life = (p.life ?? 0) + (p.pathSpeed ?? 0.012)
          const t = p.life + (p.pathOffset ?? 0)
          const waveFreqY = p.waveFreqY ?? 0.55
          const waveAmpY = p.waveAmpY ?? 8
          const waveFreqX = p.waveFreqX ?? 0.4
          const waveAmpX = p.waveAmpX ?? 0.1

          const meanderX = Math.sin(t * waveFreqX) * waveAmpX
          p.x += (p.vx ?? 0) + meanderX
          p.y =
            (p.baseY ?? p.y) +
            Math.sin(t * waveFreqY) * waveAmpY +
            Math.sin(t * waveFreqY * 1.65 + 1.1) * (waveAmpY * 0.32)

          const tilt = Math.cos(t * waveFreqY) * waveAmpY * waveFreqY * (p.pathSpeed ?? 0.012)
          p.rotation = Math.max(-0.07, Math.min(0.07, tilt * 0.006)) + Math.sin(t * 0.45) * 0.025

          const margin = p.size * 0.6
          const dir = p.direction ?? ((p.vx ?? 0) >= 0 ? 1 : -1)
          if ((dir > 0 && p.x > w + margin) || (dir < 0 && p.x < -margin)) {
            p.x = dir > 0 ? -margin : w + margin
          }
        } else {
          p.x += p.vx
          p.y += p.vy
          p.rotation += p.vr

          if (animationId === 'fireflies') {
            p.life = (p.life ?? 0) + 1
            p.opacity = 0.15 + Math.abs(Math.sin(p.life * 0.05)) * 0.75
          }
          if (animationId === 'sparkles') {
            p.opacity = 0.2 + Math.abs(Math.sin(Date.now() * 0.003 + p.x)) * 0.7
          }
          if (p.y > h + 20 || p.y < -20 || p.x < -20 || p.x > w + 20) {
            Object.assign(p, createParticle(w, h, animationId))
            if (animationId === 'stars') {
              p.y = randomBetween(-h * 0.25, -10)
            } else {
              p.y = -10
            }
          }
        }

        drawParticle(ctx, p, animationId)
      })
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (frameRef.current || !shouldRun()) return
      frameRef.current = requestAnimationFrame(tick)
    }

    const syncLoop = () => {
      if (shouldRun()) startLoop()
      else stopLoop()
    }

    document.addEventListener('visibilitychange', syncLoop)
    syncLoopRef.current = syncLoop
    syncLoop()

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', syncLoop)
      syncLoopRef.current = null
      stopLoop()
    }
  }, [animationId])

  useEffect(() => {
    syncLoopRef.current?.()
  }, [active])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
