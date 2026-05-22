import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { NoteData } from '../types/note'
import { getCardStyle } from '../data/cardStyles'
import { NoteCard } from './NoteCard'
import { EnvelopeSvg } from './EnvelopeSvg'
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
        >
          <p className="envelope__prompt">You've got a note 💌</p>
          <EnvelopeSvg envelope={style.envelope} motif={style.motif} />
          <span className="envelope__hint">tap to open</span>
        </button>
      ) : (
        <div className="envelope-scene__opened">
          <div className="envelope-reveal">
            <NoteCard note={note} showParticles />
          </div>
          <Link to="/" className="envelope-scene__send-back">
            Send one back 💌
          </Link>
        </div>
      )}
    </div>
  )
}
