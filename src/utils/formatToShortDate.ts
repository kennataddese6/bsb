export function formatToShortDate(d: Date | null, timezone: 'PST' | 'EST' | string): string {
  if (!d) return ''

  const tz = timezone === 'PST' ? 'America/Los_Angeles' : timezone === 'EST' ? 'America/New_York' : timezone // allow passing any valid IANA string

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // ensures AM/PM
    timeZone: tz
  }).format(d)
}
