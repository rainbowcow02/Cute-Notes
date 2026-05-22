import type { NoteData } from '../types/note'
import { getCardStyle } from '../data/cardStyles'
import { ParticleCanvas } from './ParticleCanvas'
import './NoteCard.css'

interface NoteCardProps {
  note: NoteData
  showParticles?: boolean
  compact?: boolean
}

function surfaceClass(style: ReturnType<typeof getCardStyle>): string {
  if (style.colors.bgPattern) return 'note-card__surface--pattern'
  if (style.colors.bg.includes('gradient')) return 'note-card__surface--gradient'
  return 'note-card__surface--fill'
}

export function NoteCard({ note, showParticles = true, compact = false }: NoteCardProps) {
  const style = getCardStyle(note.styleId)

  return (
    <article
      className={`note-card note-card--${style.id} note-card--border-${style.border.style} ${compact ? 'note-card--compact' : ''}`}
      style={
        {
          '--card-bg': style.colors.bg,
          '--card-bg-layer': style.colors.bgPattern
            ? `${style.colors.bgPattern}, ${style.colors.bg}`
            : style.colors.bg,
          '--card-frame': style.border.frame,
          '--card-frame-shadow': style.border.frameShadow ?? style.border.frame,
          '--card-inner-line': style.border.innerLine ?? style.colors.border,
          '--card-inner-line-2': style.border.innerLine2 ?? style.border.innerLine ?? style.colors.border,
          '--card-frame-padding': `${style.border.framePadding}px`,
          '--card-inner-padding': `${style.border.innerPadding}px`,
          '--card-frame-radius': `${style.border.frameRadius ?? 12}px`,
          '--card-surface-radius': `${style.border.surfaceRadius ?? 8}px`,
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
      <div className="note-card__frame">
        {style.id === 'grid-garden' && note.salutation && (
          <p className="note-card__salutation">{note.salutation}</p>
        )}

        <div className={`note-card__surface ${surfaceClass(style)}`}>
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
            {style.id !== 'grid-garden' && note.salutation && (
              <p className="note-card__salutation">{note.salutation}</p>
            )}
            <div className="note-card__body-wrap">
              {note.body ? (
                <p className="note-card__body">{note.body}</p>
              ) : (
                <p className="note-card__body note-card__placeholder">
                  your note will appear here…
                </p>
              )}
            </div>
            {note.valediction && (
              <p className="note-card__valediction">{note.valediction}</p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
