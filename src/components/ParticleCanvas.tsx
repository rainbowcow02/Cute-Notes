import { useEffect, useRef } from 'react'
import type { AnimationId } from '../types/note'
import blossom1 from '../../assets/cblossom-1.svg'
import blossom2 from '../../assets/cblossom-2.svg'
import blossom3 from '../../assets/cblossom-3.svg'
import starSvg from '../../assets/star.svg'

const BLOSSOM_SRCS = [blossom1, blossom2, blossom3]
const blossomImages: (HTMLImageElement | null)[] = [null, null, null]
let starImage: HTMLImageElement | null = null

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

loadBlossomImages()
loadStarImage()

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
  shape: 'circle' | 'star' | 'petal' | 'leaf' | 'rect'
  life?: number
}

interface ParticleCanvasProps {
  animationId: AnimationId
  active?: boolean
  className?: string
}

const COUNT = 48
const STAR_COUNT = 10
const CHERRY_BLOSSOM_COUNT = 12

function getParticleCount(id: AnimationId): number {
  if (id === 'stars') return STAR_COUNT
  if (id === 'cherry-blossoms') return CHERRY_BLOSSOM_COUNT
  return COUNT
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
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
    case 'snow':
      return { ...base, vy: randomBetween(0.3, 1.2), vx: randomBetween(-0.3, 0.3), size: randomBetween(2, 5), opacity: randomBetween(0.5, 0.95) }
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
      return { ...base, shape: 'rect', vy: randomBetween(1, 3), vx: randomBetween(-1.5, 1.5), size: randomBetween(4, 8), hue: randomBetween(0, 360), vr: randomBetween(-0.15, 0.15) }
    case 'fireflies':
      return { ...base, vy: randomBetween(-0.3, 0.3), vx: randomBetween(-0.4, 0.4), size: randomBetween(2, 4), opacity: randomBetween(0.1, 0.8), life: randomBetween(0, 100) }
    case 'leaves':
      return { ...base, shape: 'leaf', vy: randomBetween(0.5, 1.5), vx: randomBetween(-0.6, 0.6), size: randomBetween(8, 14), hue: randomBetween(70, 130) }
    case 'sparkles':
      return { ...base, shape: 'star', vy: randomBetween(-0.2, 0.2), vx: randomBetween(-0.2, 0.2), size: randomBetween(2, 5), opacity: randomBetween(0, 1) }
    case 'bubbles':
      return { ...base, vy: randomBetween(-1.5, -0.4), vx: randomBetween(-0.3, 0.3), size: randomBetween(4, 14), opacity: randomBetween(0.15, 0.4) }
    default:
      return base
  }
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

  if (id === 'rainbow-confetti' && p.hue !== undefined) {
    ctx.fillStyle = `hsl(${p.hue}, 85%, 60%)`
  } else if (id === 'leaves' && p.hue !== undefined) {
    ctx.fillStyle = `hsl(${p.hue}, 45%, 45%)`
  } else if (id === 'bubbles') {
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(0, 0, p.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
    return
  } else if (id === 'snow') {
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
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
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = window.devicePixelRatio || 1
      const { width, height } = parent.getBoundingClientRect()
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particlesRef.current = Array.from({ length: getParticleCount(animationId) }, () =>
        createParticle(width, height, animationId),
      )
    }

    resize()
    window.addEventListener('resize', resize)

    const tick = () => {
      if (!active) {
        frameRef.current = requestAnimationFrame(tick)
        return
      }

      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)
      ctx.clearRect(0, 0, w, h)

      particlesRef.current.forEach((p) => {
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
          if (animationId === 'bubbles') {
            p.y = h + 10
          } else if (animationId === 'stars') {
            p.y = randomBetween(-h * 0.25, -10)
          } else {
            p.y = -10
          }
        }

        drawParticle(ctx, p, animationId)
      })

      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frameRef.current)
    }
  }, [animationId, active])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
