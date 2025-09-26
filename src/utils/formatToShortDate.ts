export function formatToShortDate(d: Date | null): string {
  if (!d) return ''

  const mm = d.getMonth() + 1
  const dd = d.getDate()
  const yy = d.getFullYear()

  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')

  return `${mm}/${dd}/${yy} ${hours}:${minutes}`
}
