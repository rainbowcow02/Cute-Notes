export type AnimationId =
  | 'snow'
  | 'stars'
  | 'cherry-blossoms'
  | 'rainbow-confetti'
  | 'fireflies'
  | 'leaves'
  | 'sparkles'
  | 'ducks'

export type CardStyleId =
  | 'grid-garden'
  | 'duck-pond'
  | 'sakura-cloud'
  | 'starfire'
  | 'cottagecore'
  | 'y2k-candy'

export interface NoteData {
  styleId: CardStyleId
  animationId: AnimationId
  salutation: string
  body: string
  valediction: string
}

export const EMPTY_NOTE: NoteData = {
  styleId: 'grid-garden',
  animationId: 'stars',
  salutation: '',
  body: '',
  valediction: '',
}
