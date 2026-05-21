import type { NoteData } from '../types/note'
import { getCardStyle } from '../data/cardStyles'
import { ParticleCanvas } from './ParticleCanvas'
import './NoteCard.css'

interface NoteCardProps {
  note: NoteData
  showParticles?: boolean
  compact?: boolean
}

export function NoteCard({ note, showParticles = true, compact = false }: NoteCardProps) {
  const style = getCardStyle(note.styleId)
  const hasBgPattern = Boolean(style.colors.bgPattern)

  return (
    <article
      className={`note-card ${hasBgPattern ? 'note-card--pattern' : ''} ${compact ? 'note-card--compact' : ''}`}
      style={
        {
          '--card-bg': hasBgPattern ? style.colors.bg : undefined,
          '--card-bg-layer': style.colors.bgPattern ?? style.colors.bg,
          '--card-accent': style.colors.accent,
          '--card-border': style.colors.border,
          '--card-text': style.colors.text,
          '--card-text-muted': style.colors.textMuted,
          '--card-ink': style.colors.ink,
          '--font-salutation': style.fonts.salutation,
          '--font-body': style.fonts.body,
          '--font-valediction': style.fonts.valediction,
        } as React.CSSProperties
      }
    >
      {showParticles && (
        <div className="note-card__particles">
          <ParticleCanvas animationId={note.animationId} />
        </div>
      )}

      <div className="note-card__motif note-card__motif--tl" aria-hidden="true">
        {style.motif}
      </div>
      {style.motifSecondary && (
        <div className="note-card__motif note-card__motif--br" aria-hidden="true">
          {style.motifSecondary}
        </div>
      )}

      <div className="note-card__inner">
        {note.salutation && (
          <p className="note-card__salutation">{note.salutation}</p>
        )}
        {note.body ? (
          <p className="note-card__body">{note.body}</p>
        ) : (
          <p className="note-card__body note-card__placeholder">
            your note will appear here…
          </p>
        )}
        {note.valediction && (
          <p className="note-card__valediction">{note.valediction}</p>
        )}
      </div>
    </article>
  )
}
