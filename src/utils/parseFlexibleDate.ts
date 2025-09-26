export function parseFlexibleDate(s: string | undefined): Date {
  if (!s) return new Date()
  const parts = s.split('/').map(p => p.trim())

  if (parts.length >= 3) {
    const m = Number(parts[0])
    const d = Number(parts[1])
    let y = Number(parts[2])

    if (parts[2].length === 2) {
      y = y + (y < 70 ? 2000 : 1900)
    }

    const dt = new Date(y, m - 1, d)

    if (!isNaN(dt.getTime())) return dt
  }

  const dt2 = new Date(s)

  if (!isNaN(dt2.getTime())) return dt2

  return new Date()
}
