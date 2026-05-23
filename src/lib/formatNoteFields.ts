const VALEDICTION_PREFIX = '– '

export function stripSalutationPunctuation(value: string): string {
  return value.replace(/,\s*$/, '')
}

export function stripValedictionPunctuation(value: string): string {
  return value.replace(/^[-–—]\s*/, '')
}

export function formatSalutation(value: string, maxLength = 80): string {
  const trimmed = stripSalutationPunctuation(value).trimEnd()
  if (!trimmed) return ''
  return `${trimmed},`.slice(0, maxLength)
}

export function formatValediction(value: string, maxLength = 80): string {
  const trimmed = stripValedictionPunctuation(value).trim()
  if (!trimmed) return ''
  const text = trimmed
  if (!text) return ''
  return `${VALEDICTION_PREFIX}${text}`.slice(0, maxLength)
}
