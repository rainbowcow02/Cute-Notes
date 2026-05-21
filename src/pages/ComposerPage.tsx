import { useState } from 'react'
import type { AnimationId, CardStyleId, NoteData } from '../types/note'
import { EMPTY_NOTE } from '../types/note'
import { CARD_STYLES, getCardStyle } from '../data/cardStyles'
import { ANIMATIONS } from '../data/animations'
import { NoteCard } from '../components/NoteCard'
import { ShareModal } from '../components/ShareModal'
import { noteShareUrl } from '../lib/encodeNote'
import './ComposerPage.css'

const BODY_MAX = 150

export function ComposerPage() {
  const [note, setNote] = useState<NoteData>(EMPTY_NOTE)
  const [previewing, setPreviewing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const style = getCardStyle(note.styleId)

  const update = (patch: Partial<NoteData>) => setNote((n) => ({ ...n, ...patch }))

  const selectStyle = (id: CardStyleId) => {
    const card = getCardStyle(id)
    setNote((n) => ({
      ...n,
      styleId: id,
      animationId: card.defaultAnimation,
    }))
  }

  const canSend = note.body.trim().length > 0

  const send = () => {
    if (!canSend) return
    setShareUrl(noteShareUrl(note))
    setPreviewing(false)
  }

  return (
    <div className="composer">
      <header className="composer__header">
        <h1 className="composer__logo">Cute Notes</h1>
        <p className="composer__tagline">Write a note. Pick a vibe. Send a moment.</p>
      </header>

      <main className="composer__main">
        {/* Step 1: Card style */}
        <section className="composer__section">
          <h2 className="composer__section-title">
            <span className="composer__step">1</span> Pick your stationery
          </h2>
          <div className="style-picker" role="listbox" aria-label="Card styles">
            {CARD_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="option"
                aria-selected={note.styleId === s.id}
                className={`style-picker__item ${note.styleId === s.id ? 'style-picker__item--active' : ''}`}
                onClick={() => selectStyle(s.id)}
                style={
                  {
                    '--swatch-layer': s.colors.bgPattern ?? s.colors.bg,
                    '--swatch-border': s.colors.border,
                  } as React.CSSProperties
                }
              >
                <span className="style-picker__motif">{s.motif}</span>
                <span className="style-picker__name">{s.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Write */}
        <section className="composer__section composer__section--write">
          <h2 className="composer__section-title">
            <span className="composer__step">2</span> Write your note
          </h2>

          <div
            className={`stationery-pad ${style.colors.bgPattern ? 'stationery-pad--pattern' : ''}`}
            style={
              {
                '--pad-bg': style.colors.bgPattern ? style.colors.bg : undefined,
                '--pad-layer': style.colors.bgPattern ?? style.colors.bg,
                '--pad-border': style.colors.border,
                '--pad-text': style.colors.ink,
                '--pad-muted': style.colors.textMuted,
                '--font-salutation': style.fonts.salutation,
                '--font-body': style.fonts.body,
                '--font-valediction': style.fonts.valediction,
              } as React.CSSProperties
            }
          >
            <span className="stationery-pad__motif" aria-hidden="true">
              {style.motif}
            </span>

            <label className="stationery-field">
              <span className="visually-hidden">Salutation</span>
              <input
                type="text"
                className="stationery-field__input stationery-field__input--salutation"
                placeholder="dear my little duck prince,"
                value={note.salutation}
                onChange={(e) => update({ salutation: e.target.value })}
                maxLength={80}
              />
            </label>

            <label className="stationery-field stationery-field--body">
              <span className="visually-hidden">Note body</span>
              <textarea
                className="stationery-field__input stationery-field__input--body"
                placeholder="I miss your face today."
                value={note.body}
                onChange={(e) => update({ body: e.target.value.slice(0, BODY_MAX) })}
                rows={4}
                maxLength={BODY_MAX}
              />
              <span className="stationery-field__count" aria-live="polite">
                {note.body.length}/{BODY_MAX}
              </span>
            </label>

            <label className="stationery-field">
              <span className="visually-hidden">Valediction</span>
              <input
                type="text"
                className="stationery-field__input stationery-field__input--valediction"
                placeholder="– your little ketchup packet"
                value={note.valediction}
                onChange={(e) => update({ valediction: e.target.value })}
                maxLength={80}
              />
            </label>
          </div>
        </section>

        {/* Step 3: Animation */}
        <section className="composer__section">
          <h2 className="composer__section-title">
            <span className="composer__step">3</span> Pick a vibe
          </h2>
          <div className="animation-picker" role="listbox" aria-label="Animation effects">
            {ANIMATIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                role="option"
                aria-selected={note.animationId === a.id}
                className={`animation-picker__item ${note.animationId === a.id ? 'animation-picker__item--active' : ''}`}
                onClick={() => update({ animationId: a.id as AnimationId })}
              >
                <span className="animation-picker__emoji">{a.emoji}</span>
                <span className="animation-picker__label">{a.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Live mini preview */}
        <section className="composer__section composer__section--preview-mini">
          <h2 className="composer__section-title">Live preview</h2>
          <div className="composer__card-wrap">
            <NoteCard note={note} showParticles compact />
          </div>
        </section>
      </main>

      <footer className="composer__footer">
        <button
          type="button"
          className="composer__btn composer__btn--secondary"
          onClick={() => setPreviewing(true)}
          disabled={!canSend}
        >
          Preview
        </button>
        <button
          type="button"
          className="composer__btn composer__btn--primary"
          onClick={send}
          disabled={!canSend}
        >
          Send moment
        </button>
      </footer>

      {previewing && (
        <div className="preview-overlay" role="dialog" aria-modal="true" aria-label="Preview">
          <div className="preview-overlay__inner">
            <p className="preview-overlay__label">This is what they'll see</p>
            <NoteCard note={note} showParticles />
            <div className="preview-overlay__actions">
              <button type="button" className="composer__btn composer__btn--secondary" onClick={() => setPreviewing(false)}>
                Back
              </button>
              <button type="button" className="composer__btn composer__btn--primary" onClick={send}>
                Send moment
              </button>
            </div>
          </div>
        </div>
      )}

      {shareUrl && <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />}
    </div>
  )
}
