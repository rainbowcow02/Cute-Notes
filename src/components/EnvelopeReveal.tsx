import { useState } from 'react'
import type { NoteData } from '../types/note'
import { getCardStyle } from '../data/cardStyles'
import { NoteCard } from './NoteCard'
import './EnvelopeReveal.css'

interface EnvelopeRevealProps {
  note: NoteData
}

export function EnvelopeReveal({ note }: EnvelopeRevealProps) {
  const [opened, setOpened] = useState(false)
  const style = getCardStyle(note.styleId)

  return (
    <div className="envelope-scene">
      {!opened ? (
        <button
          type="button"
          className="envelope"
          onClick={() => setOpened(true)}
          aria-label="Open your note"
          style={
            {
              '--env-outer': style.envelope.outer,
              '--env-inner': style.envelope.inner,
              '--env-flap': style.envelope.flap,
              '--env-seal': style.envelope.seal,
              '--env-seal-text': style.envelope.sealText,
            } as React.CSSProperties
          }
        >
          <p className="envelope__prompt">You've got a note 💌</p>
          <div className="envelope__body">
            <div className="envelope__pocket" />
            <div className="envelope__flap" />
            <div className="envelope__seal">
              <span>{style.motif}</span>
            </div>
          </div>
          <span className="envelope__hint">tap to open</span>
        </button>
      ) : (
        <div className="envelope-reveal">
          <NoteCard note={note} showParticles />
        </div>
      )}
    </div>
  )
}
