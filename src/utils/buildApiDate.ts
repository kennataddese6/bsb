import { parseFlexibleDate } from './parseFlexibleDate'

// Helpers to build labels and API date strings for KPI cards (no timezone suffix)
export const buildApiDate = (value: string): string => {
  const d = parseFlexibleDate(value)

  if (!d) return ''
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())

  return `${year}-${month}-${day}T${hours}:${minutes}:00`
}
