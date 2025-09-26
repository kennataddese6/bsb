export function formatForDatetimeLocal(d: Date | null): string {
  if (!d) return ''
  const pad = (n: number) => n.toString().padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const min = pad(d.getMinutes())

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}
