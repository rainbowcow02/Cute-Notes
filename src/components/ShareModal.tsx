import { useState } from 'react'
import './ShareModal.css'

interface ShareModalProps {
  url: string
  onClose: () => void
}

export function ShareModal({ url, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* fallback: user can select manually */
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="share-title">
      <div className="share-modal">
        <button type="button" className="share-modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 id="share-title" className="share-modal__title">
          Your wish is drifting ✨
        </h2>
        <p className="share-modal__subtitle">
          Share this link — no account, just starlight
        </p>
        <div className="share-modal__url-row">
          <input className="share-modal__url" readOnly value={url} onFocus={(e) => e.target.select()} />
          <button type="button" className="share-modal__copy" onClick={copy}>
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
        <p className="share-modal__hint">Send via text, DMs, or anywhere the sky reaches</p>
        <button type="button" className="share-modal__done" onClick={onClose}>
          Back to the clouds
        </button>
      </div>
    </div>
  )
}
