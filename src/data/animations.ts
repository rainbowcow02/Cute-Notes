import type { AnimationId } from '../types/note'

export interface AnimationOption {
  id: AnimationId
  emoji: string
  label: string
}

export const ANIMATIONS: AnimationOption[] = [
  { id: 'snow', emoji: '❄️', label: 'Snow' },
  { id: 'stars', emoji: '⭐', label: 'Stars' },
  { id: 'cherry-blossoms', emoji: '🌸', label: 'Flowers' },
  { id: 'rainbow-confetti', emoji: '🎊', label: 'Confetti' },
  { id: 'fireflies', emoji: '🔥', label: 'Fireflies' },
  { id: 'leaves', emoji: '🍃', label: 'Leaves' },
  { id: 'sparkles', emoji: '💫', label: 'Sparkles' },
  { id: 'bubbles', emoji: '🫧', label: 'Bubbles' },
]

export function getAnimation(id: AnimationId) {
  return ANIMATIONS.find((a) => a.id === id) ?? ANIMATIONS[1]
}
