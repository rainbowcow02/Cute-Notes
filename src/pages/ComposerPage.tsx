import { memo, useCallback, useRef, useState } from 'react'
import type { AnimationId, CardStyleId, NoteData } from '../types/note'
import { CARD_STYLES, getCardStyle } from '../data/cardStyles'
import { ANIMATIONS } from '../data/animations'
import { NoteCard } from '../components/NoteCard'
import { ParticleCanvas } from '../components/ParticleCanvas'
import { ShareModal } from '../components/ShareModal'
import { noteShareUrl } from '../lib/encodeNote'
import { formatSalutation, formatValediction, stripSalutationPunctuation, stripValedictionPunctuation } from '../lib/formatNoteFields'
import './ComposerPage.css'

const BODY_MAX = 150

/** Dreamcore exploration demo — Sakura Cloud + cherry blossoms */
const EXPLORATION_DEMO: NoteData = {
  styleId: 'sakura-cloud',
  animationId: 'cherry-blossoms',
  salutation: 'dear my little duck prince',
  body: '',
  valediction: 'your little ketchup packet',
}

type TextDraft = Pick<NoteData, 'salutation' | 'body' | 'valediction'>

function DecoratedSalutationInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <span className="stationery-field__decorated stationery-field__decorated--salutation">
      <input
        type="text"
        className="stationery-field__input stationery-field__input--salutation"
        placeholder="dear my little duck prince,"
        value={value}
        onChange={(e) => onChange(stripSalutationPunctuation(e.target.value))}
        maxLength={80}
      />
      <span className="stationery-field__auto-punct" aria-hidden="true">
        ,
      </span>
    </span>
  )
}

function DecoratedValedictionInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <span className="stationery-field__decorated stationery-field__decorated--valediction">
      <span className="stationery-field__decorated-inner">
        <span className="stationery-field__auto-punct stationery-field__auto-punct--prefix" aria-hidden="true">
          –
        </span>
        <input
          type="text"
          className="stationery-field__input stationery-field__input--valediction"
          placeholder="your little ketchup packet"
          value={value}
          onChange={(e) => onChange(stripValedictionPunctuation(e.target.value))}
          maxLength={80}
        />
      </span>
    </span>
  )
}

const ComposerAmbient = memo(function ComposerAmbient() {
  return (
    <div className="composer__ambient" aria-hidden="true">
      <div className="composer__stars" />
      <div className="composer__cloud-field">
        <span className="composer__cloud-puff composer__cloud-puff--1" />
        <span className="composer__cloud-puff composer__cloud-puff--2" />
        <span className="composer__cloud-puff composer__cloud-puff--3" />
        <span className="composer__cloud-puff composer__cloud-puff--4" />
        <span className="composer__cloud-puff composer__cloud-puff--5" />
        <span className="composer__cloud-puff composer__cloud-puff--6" />
        <span className="composer__cloud-puff composer__cloud-puff--7" />
        <span className="composer__cloud-puff composer__cloud-puff--8" />
        <span className="composer__cloud-puff composer__cloud-puff--9" />
        <span className="composer__cloud-puff composer__cloud-puff--10" />
        <span className="composer__cloud-puff composer__cloud-puff--11" />
        <span className="composer__cloud-puff composer__cloud-puff--12" />
        <span className="composer__cloud-puff composer__cloud-puff--13" />
        <span className="composer__cloud-puff composer__cloud-puff--14" />
      </div>
      <div className="composer__clouds composer__clouds--horizon" />
      <div className="composer__glitter" />
    </div>
  )
})

const StylePickerSection = memo(function StylePickerSection({
  styleId,
  onSelectStyle,
}: {
  styleId: CardStyleId
  onSelectStyle: (id: CardStyleId) => void
}) {
  return (
    <section className="composer__section composer__section--styles">
      <h2 className="composer__section-title">
        <span className="composer__step">1</span> Pick stationery
      </h2>
      <div className="style-picker" role="listbox" aria-label="Card styles">
        {CARD_STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            role="option"
            aria-selected={styleId === s.id}
            className={`style-picker__item ${styleId === s.id ? 'style-picker__item--active' : ''}`}
            onClick={() => onSelectStyle(s.id)}
            style={
              {
                '--swatch-bg': s.colors.bg,
                '--swatch-layer': s.colors.bgPattern
                  ? `${s.colors.bgPattern}${s.colors.bg.startsWith('linear-gradient') ? `, ${s.colors.bg}` : ''}`
                  : s.colors.bg,
                '--swatch-border': s.colors.border,
                '--swatch-text': s.colors.swatchLabel ?? s.colors.text,
              } as React.CSSProperties
            }
          >
            <span className="style-picker__tab" aria-hidden="true" />
            <span className="style-picker__motif">{s.motif}</span>
            <span className="style-picker__name">{s.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
})

const AnimationPickerSection = memo(function AnimationPickerSection({
  animationId,
  onSelectAnimation,
}: {
  animationId: AnimationId
  onSelectAnimation: (id: AnimationId) => void
}) {
  return (
    <section className="composer__section composer__section--animations">
      <h2 className="composer__section-title">
        <span className="composer__step">2</span> Add effect
      </h2>
      <div className="animation-picker" role="listbox" aria-label="Animation effects">
        {ANIMATIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            role="option"
            aria-selected={animationId === a.id}
            className={`animation-picker__item ${animationId === a.id ? 'animation-picker__item--active' : ''}`}
            onClick={() => onSelectAnimation(a.id as AnimationId)}
          >
            <span className="animation-picker__emoji">{a.emoji}</span>
            <span className="animation-picker__label">{a.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
})

const StationeryPadEditor = memo(function StationeryPadEditor({
  styleId,
  animationId,
  particlesActive,
  initialDraft,
  draftRef,
  onCanSendChange,
}: {
  styleId: CardStyleId
  animationId: AnimationId
  particlesActive: boolean
  initialDraft: TextDraft
  draftRef: React.MutableRefObject<TextDraft>
  onCanSendChange: (canSend: boolean) => void
}) {
  const [draft, setDraft] = useState<TextDraft>(initialDraft)

  const updateDraft = useCallback(
    (patch: Partial<TextDraft>) => {
      setDraft((prev) => {
        const next = { ...prev, ...patch }
        draftRef.current = next
        onCanSendChange(next.body.trim().length > 0)
        return next
      })
    },
    [draftRef, onCanSendChange],
  )

  const style = getCardStyle(styleId)

  return (
    <aside className="composer__preview-column" aria-label="Live preview">
      <h2 className="composer__section-title composer__section-title--preview">
        <span className="composer__step composer__step--preview" aria-hidden="true">✦</span>
        What&apos;s on your mind?
        <span className="composer__step composer__step--preview" aria-hidden="true">✦</span>
      </h2>
      <div className="composer__card-float">
        <div className="composer__card-wrap">
          <div
            className={`stationery-pad note-card--${style.id} note-card--border-${style.border.style}`}
            style={
              {
                '--card-bg': style.colors.bg,
                '--card-bg-layer': style.colors.bgPattern
                  ? `${style.colors.bgPattern}, ${style.colors.bg}`
                  : style.colors.bg,
                '--card-frame': style.border.frame,
                '--card-frame-shadow': style.border.frameShadow ?? style.border.frame,
                '--card-inner-line': style.border.innerLine ?? style.colors.border,
                '--card-inner-line-2':
                  style.border.innerLine2 ?? style.border.innerLine ?? style.colors.border,
                '--card-frame-padding': `${style.border.framePadding}px`,
                '--card-inner-padding': `${style.border.innerPadding}px`,
                '--card-frame-radius': `${style.border.frameRadius ?? 12}px`,
                '--card-surface-radius': `${style.border.surfaceRadius ?? 8}px`,
                '--pad-text': style.colors.ink,
                '--pad-muted': style.colors.textMuted,
                '--font-salutation': style.fonts.salutation,
                '--font-body': style.fonts.body,
                '--font-valediction': style.fonts.valediction,
              } as React.CSSProperties
            }
          >
            <div className="stationery-pad__frame">
              {style.id === 'duck-pond' && (
                <>
                  <span
                    className="stationery-pad__border-brush stationery-pad__border-brush--back"
                    aria-hidden="true"
                  />
                  <span className="stationery-pad__border-brush" aria-hidden="true" />
                </>
              )}

              {style.id === 'grid-garden' && (
                <label className="stationery-field stationery-field--salutation">
                  <span className="visually-hidden">Salutation</span>
                  <DecoratedSalutationInput
                    value={draft.salutation}
                    onChange={(salutation) => updateDraft({ salutation })}
                  />
                </label>
              )}

              <div
                className={`stationery-pad__surface ${
                  style.colors.bgPattern
                    ? 'stationery-pad__surface--pattern'
                    : style.colors.bg.includes('gradient')
                      ? 'stationery-pad__surface--gradient'
                      : 'stationery-pad__surface--fill'
                }`}
              >
                <div className="stationery-pad__particles">
                  <ParticleCanvas animationId={animationId} active={particlesActive} />
                </div>

                <span className="stationery-pad__motif" aria-hidden="true">
                  {style.motif}
                </span>

                <div className="note-card__inner">
                  {style.id !== 'grid-garden' && (
                    <label className="stationery-field">
                      <span className="visually-hidden">Salutation</span>
                      <DecoratedSalutationInput
                        value={draft.salutation}
                        onChange={(salutation) => updateDraft({ salutation })}
                      />
                    </label>
                  )}

                  <label className="stationery-field stationery-field--body">
                    <span className="visually-hidden">Note body</span>
                    <div className="stationery-field__body-wrap">
                      <textarea
                        className="stationery-field__input stationery-field__input--body"
                        placeholder="I miss your face today."
                        value={draft.body}
                        onChange={(e) => updateDraft({ body: e.target.value.slice(0, BODY_MAX) })}
                        rows={1}
                        maxLength={BODY_MAX}
                      />
                    </div>
                    <span className="stationery-field__count" aria-live="polite">
                      {draft.body.length}/{BODY_MAX}
                    </span>
                  </label>

                  <label className="stationery-field">
                    <span className="visually-hidden">Valediction</span>
                    <DecoratedValedictionInput
                      value={draft.valediction}
                      onChange={(valediction) => updateDraft({ valediction })}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
})

export function ComposerPage() {
  const [styleId, setStyleId] = useState<CardStyleId>(EXPLORATION_DEMO.styleId)
  const [animationId, setAnimationId] = useState<AnimationId>(EXPLORATION_DEMO.animationId)
  const [previewing, setPreviewing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [canSend, setCanSend] = useState(false)

  const draftRef = useRef<TextDraft>({
    salutation: EXPLORATION_DEMO.salutation,
    body: EXPLORATION_DEMO.body,
    valediction: EXPLORATION_DEMO.valediction,
  })

  const selectStyle = useCallback((id: CardStyleId) => {
    const card = getCardStyle(id)
    setStyleId(id)
    setAnimationId(card.defaultAnimation)
  }, [])

  const selectAnimation = useCallback((id: AnimationId) => {
    setAnimationId(id)
  }, [])

  const handleCanSendChange = useCallback((next: boolean) => {
    setCanSend(next)
  }, [])

  const buildNote = useCallback((): NoteData => {
    const draft = draftRef.current
    return {
      styleId,
      animationId,
      salutation: draft.salutation,
      body: draft.body,
      valediction: draft.valediction,
    }
  }, [styleId, animationId])

  const send = () => {
    if (!canSend) return
    const note = buildNote()
    setShareUrl(
      noteShareUrl({
        ...note,
        salutation: formatSalutation(note.salutation),
        valediction: formatValediction(note.valediction),
      }),
    )
    setPreviewing(false)
  }

  return (
    <div className="composer">
      <ComposerAmbient />

      <header className="composer__header">
        <div className="composer__logo-wrap">
          <span className="composer__logo-sparkles" aria-hidden="true" />
          <span className="composer__logo-halo" aria-hidden="true" />
          <h1 className="composer__logo">Cute Notes</h1>
        </div>
        <p className="composer__tagline">Float a note into someone&apos;s sky</p>
      </header>

      <main className="composer__main">
        <div className="composer__steps">
          <StylePickerSection styleId={styleId} onSelectStyle={selectStyle} />
          <AnimationPickerSection animationId={animationId} onSelectAnimation={selectAnimation} />
        </div>

        <StationeryPadEditor
          styleId={styleId}
          animationId={animationId}
          particlesActive={!previewing}
          initialDraft={draftRef.current}
          draftRef={draftRef}
          onCanSendChange={handleCanSendChange}
        />
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
          Send note
        </button>
      </footer>

      {previewing && (
        <div className="preview-overlay" role="dialog" aria-modal="true" aria-label="Preview">
          <div className="preview-overlay__inner">
            <h2 className="preview-overlay__label">
              <span className="preview-overlay__label-star" aria-hidden="true">✦</span>
              Note preview
              <span className="preview-overlay__label-star" aria-hidden="true">✦</span>
            </h2>
            <NoteCard note={buildNote()} showParticles />
            <div className="preview-overlay__actions">
              <button type="button" className="composer__btn composer__btn--secondary" onClick={() => setPreviewing(false)}>
                Back
              </button>
              <button type="button" className="composer__btn composer__btn--primary" onClick={send}>
                Send note
              </button>
            </div>
          </div>
        </div>
      )}

      {shareUrl && <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />}
    </div>
  )
}
