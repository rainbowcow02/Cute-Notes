import type { AnimationId, CardStyleId } from '../types/note'

export interface CardStyle {
  id: CardStyleId
  name: string
  vibe: string
  motif: string
  motifSecondary?: string
  defaultAnimation: AnimationId
  fonts: {
    salutation: string
    body: string
    valediction: string
  }
  colors: {
    bg: string
    bgPattern?: string
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
    fonts: { salutation: 'Itim', body: '"Jersey 15"', valediction: 'Itim' },
    colors: {
      bg: '#e8f4ec',
      bgPattern:
        'linear-gradient(#d4e8da 1px, transparent 1px), linear-gradient(90deg, #d4e8da 1px, transparent 1px)',
      accent: '#7eb89a',
      border: '#e8c547',
      text: '#2d4a38',
      textMuted: '#5a7d68',
      ink: '#1e3a2c',
    },
    envelope: {
      outer: '#b8dcc4',
      inner: '#d4ecd9',
      flap: '#9ec9ad',
      seal: '#e8c547',
      sealText: '#5a4a10',
    },
  },
  {
    id: 'duck-pond',
    name: 'Duck Pond',
    vibe: 'Quirky & bold',
    motif: '🦆',
    motifSecondary: '💧',
    defaultAnimation: 'rainbow-confetti',
    fonts: { salutation: 'Itim', body: 'Kurale', valediction: 'Itim' },
    colors: {
      bg: '#1a4fd6',
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
    fonts: { salutation: '"Jersey 15"', body: '"Jersey 15"', valediction: '"Jersey 15"' },
    colors: {
      bg: 'linear-gradient(135deg, #ff4da6 0%, #7ee8fa 50%, #c8f542 100%)',
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
