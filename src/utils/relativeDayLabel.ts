export const getRelativeDayLabel = (
  date: string,
  timezone: 'PST' | 'EST' | string
): 'Today ·' | 'Yesterday ·' | 'Last week ·' | '' => {
  const tz = timezone === 'PST' ? 'America/Los_Angeles' : timezone === 'EST' ? 'America/New_York' : timezone

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: tz
    }).format(d)

  const today = new Date()
  const yesterday = new Date(today)

  yesterday.setDate(today.getDate() - 1)

  const lastWeek = new Date(today)

  lastWeek.setDate(today.getDate() - 7)

  return date === formatDate(today)
    ? 'Today ·'
    : date === formatDate(yesterday)
      ? 'Yesterday ·'
      : date === formatDate(lastWeek)
        ? 'Last week ·'
        : ''
}
