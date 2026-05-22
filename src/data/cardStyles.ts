import type { AnimationId, CardStyleId } from '../types/note'

export type CardBorderStyle = 'chunky' | 'layered' | 'scalloped' | 'celestial' | 'rustic' | 'pixel'

export interface CardStyle {
  id: CardStyleId
  name: string
  vibe: string
  motif: string
  motifSecondary?: string
  defaultAnimation: AnimationId
  border: {
    style: CardBorderStyle
    frame: string
    frameShadow?: string
    innerLine?: string
    innerLine2?: string
    framePadding: number
    innerPadding: number
    frameRadius?: number
    surfaceRadius?: number
  }
  fonts: {
    salutation: string
    body: string
    valediction: string
  }
  colors: {
    bg: string
    bgPattern?: string
    surface?: string
    accent: string
    border: string
    text: string
    textMuted: string
    ink: string
  }
  envelope: {
    outer: string
    inner: string
    flap: string
    seal: string
    sealText: string
  }
}

export const CARD_STYLES: CardStyle[] = [
  {
    id: 'grid-garden',
    name: 'Grid Garden',
    vibe: 'Sweet pastel stationery',
    motif: '✦',
    motifSecondary: '🌿',
    defaultAnimation: 'stars',
    border: {
      style: 'chunky',
      frame: '#dff2dc',
      frameShadow: '#c5e8c8',
      innerLine: 'transparent',
      framePadding: 15,
      innerPadding: 24,
      frameRadius: 19,
      surfaceRadius: 17,
    },
    fonts: { salutation: 'Itim', body: '"Jersey 15"', valediction: 'Itim' },
    colors: {
      bg: '#fefefe',
      bgPattern:
        'linear-gradient(#e9e9e9 0.5px, transparent 0.5px), linear-gradient(90deg, #e9e9e9 0.5px, transparent 0.5px)',
      accent: '#d8f3e6',
      border: '#e9e9e9',
      text: '#0e5be2',
      textMuted: '#0e5be2',
      ink: '#0e5be2',
    },
    envelope: {
      outer: '#dff2dc',
      inner: '#fefefe',
      flap: '#c8e8c4',
      seal: '#0e5be2',
      sealText: '#fefefe',
    },
  },
  {
    id: 'duck-pond',
    name: 'Duck Pond',
    vibe: 'Quirky & bold',
    motif: '🦆',
    motifSecondary: '💧',
    defaultAnimation: 'rainbow-confetti',
    border: {
      style: 'layered',
      frame: '#0f2f8f',
      innerLine: '#ffffff',
      innerLine2: '#ffffff',
      framePadding: 24,
      innerPadding: 22,
      frameRadius: 12,
      surfaceRadius: 4,
    },
    fonts: { salutation: 'Itim', body: 'Kurale', valediction: 'Itim' },
    colors: {
      bg: 'linear-gradient(175deg, #2a65e8 0%, #1a4fd6 45%, #123a9e 100%)',
      accent: '#ffffff',
      border: '#ffffff',
      text: '#ffffff',
      textMuted: '#c8d9ff',
      ink: '#ffffff',
    },
    envelope: {
      outer: '#153db8',
      inner: '#1e55e0',
      flap: '#0f2f8f',
      seal: '#ffffff',
      sealText: '#1a4fd6',
    },
  },
  {
    id: 'sakura-cloud',
    name: 'Sakura Cloud',
    vibe: 'Romantic & airy',
    motif: '🌸',
    motifSecondary: '☁️',
    defaultAnimation: 'cherry-blossoms',
    border: {
      style: 'scalloped',
      frame: '#f0c8d8',
      innerLine: '#ffffff',
      innerLine2: '#fce8ef',
      framePadding: 16,
      innerPadding: 20,
      frameRadius: 20,
      surfaceRadius: 255,
    },
    fonts: { salutation: 'Kurale', body: 'Kurale', valediction: 'Itim' },
    colors: {
      bg: 'linear-gradient(165deg, #fce8ef 0%, #e8f0e4 55%, #faf6f8 100%)',
      accent: '#e8a0b4',
      border: '#f0d4dc',
      text: '#5c3d48',
      textMuted: '#9a7080',
      ink: '#4a2c38',
    },
    envelope: {
      outer: '#f5d0dc',
      inner: '#fce8ef',
      flap: '#e8b8c8',
      seal: '#e8a0b4',
      sealText: '#fff8fa',
    },
  },
  {
    id: 'starfire',
    name: 'Starfire',
    vibe: 'Dreamy & celestial',
    motif: '✧',
    motifSecondary: '🌙',
    defaultAnimation: 'stars',
    border: {
      style: 'celestial',
      frame: '#d4a574',
      frameShadow: '#9b7bb8',
      innerLine: 'rgba(245, 230, 200, 0.6)',
      innerLine2: 'rgba(155, 123, 184, 0.5)',
      framePadding: 20,
      innerPadding: 24,
      frameRadius: 14,
      surfaceRadius: 8,
    },
    fonts: { salutation: 'Kurale', body: '"Jersey 15"', valediction: 'Kurale' },
    colors: {
      bg: 'linear-gradient(160deg, #1a1428 0%, #2d1f3d 50%, #1e1630 100%)',
      accent: '#d4a574',
      border: '#d4a574',
      text: '#f5ebe0',
      textMuted: '#b8a090',
      ink: '#faf0e8',
    },
    envelope: {
      outer: '#2a1f40',
      inner: '#352848',
      flap: '#1e1630',
      seal: '#d4a574',
      sealText: '#1a1428',
    },
  },
  {
    id: 'cottagecore',
    name: 'Cottagecore',
    vibe: 'Warm & whimsical',
    motif: '🍄',
    motifSecondary: '🌾',
    defaultAnimation: 'leaves',
    border: {
      style: 'rustic',
      frame: '#c4a882',
      frameShadow: '#a08060',
      innerLine: '#b85c38',
      framePadding: 12,
      innerPadding: 20,
      frameRadius: 32,
      surfaceRadius: 24,
    },
    fonts: { salutation: 'Itim', body: 'Itim', valediction: 'Itim' },
    colors: {
      bg: '#f5ebe0',
      bgPattern:
        'radial-gradient(circle at 20% 80%, #e8d4c0 0%, transparent 50%), radial-gradient(circle at 80% 20%, #d8e8d0 0%, transparent 40%)',
      accent: '#b85c38',
      border: '#c4a882',
      text: '#4a3020',
      textMuted: '#8a6858',
      ink: '#3a2418',
    },
    envelope: {
      outer: '#d4c0a8',
      inner: '#e8dcc8',
      flap: '#c4a882',
      seal: '#b85c38',
      sealText: '#f5ebe0',
    },
  },
  {
    id: 'y2k-candy',
    name: 'Y2K Candy',
    vibe: 'Bold & chaotic fun',
    motif: '★',
    motifSecondary: '💿',
    defaultAnimation: 'rainbow-confetti',
    border: {
      style: 'pixel',
      frame: '#2a1040',
      frameShadow: '#000000',
      innerLine: '#ffffff',
      innerLine2: '#c8f542',
      framePadding: 14,
      innerPadding: 18,
      frameRadius: 0,
      surfaceRadius: 0,
    },
    fonts: { salutation: '"Jersey 15"', body: '"Jersey 15"', valediction: '"Jersey 15"' },
    colors: {
      bg: 'linear-gradient(180deg, #ff6eb8 0%, #7ee8fa 50%, #c8f542 100%)',
      bgPattern:
        'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
      accent: '#ffffff',
      border: '#ffffff',
      text: '#ffffff',
      textMuted: '#fff8fc',
      ink: '#ffffff',
    },
    envelope: {
      outer: '#ff2d8a',
      inner: '#ff6eb8',
      flap: '#e01070',
      seal: '#c8f542',
      sealText: '#2a1040',
    },
  },
]

export function getCardStyle(id: CardStyleId): CardStyle {
  return CARD_STYLES.find((s) => s.id === id) ?? CARD_STYLES[0]
}
