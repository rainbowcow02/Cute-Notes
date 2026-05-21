import type { NoteData } from '../types/note'

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(encoded: string): string {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  const binary = atob(padded + pad)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function encodeNote(note: NoteData): string {
  return toBase64Url(JSON.stringify(note))
}

export function decodeNote(encoded: string): NoteData | null {
  try {
    const json = fromBase64Url(encoded)
    const data = JSON.parse(json) as NoteData
    if (!data.body && !data.salutation && !data.valediction) return null
    return data
  } catch {
    return null
  }
}

/** Production app URL — share links always point here so receivers aren't stuck on localhost. */
export const PUBLIC_APP_URL =
  (import.meta.env.VITE_PUBLIC_APP_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://cute-notes-roan.vercel.app'

export function noteShareUrl(note: NoteData): string {
  const id = encodeNote(note)
  return `${PUBLIC_APP_URL}/n/${id}`
}
