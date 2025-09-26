import { parseFlexibleDate } from './parseFlexibleDate'

export const buildApiDateMidnight = (value: string): string => {
  const d = parseFlexibleDate(value)

  if (!d) return ''
  d.setHours(0, 0, 0, 0)
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())

  return `${year}-${month}-${day}T00:00:00`
}
