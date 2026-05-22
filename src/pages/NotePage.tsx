import { useParams, Link } from 'react-router-dom'
import { decodeNote } from '../lib/encodeNote'
import { EnvelopeReveal } from '../components/EnvelopeReveal'
import './NotePage.css'

export function NotePage() {
  const { id } = useParams<{ id: string }>()
  const note = id ? decodeNote(id) : null

  if (!note) {
    return (
      <div className="note-page note-page--error">
        <p className="note-page__error-msg">This note couldn't be found 💔</p>
        <p className="note-page__error-hint">The link may be broken or incomplete.</p>
        <Link to="/" className="note-page__home-link">
          Send a new note
        </Link>
      </div>
    )
  }

  return (
    <div className="note-page">
      <main className="note-page__main">
        <EnvelopeReveal note={note} />
      </main>
      <footer className="note-page__footer">
        <Link to="/" className="note-page__brand">
          Cute Notes
        </Link>
      </footer>
    </div>
  )
}
