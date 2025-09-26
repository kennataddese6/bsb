export function defaultDate(timezone: 'PST' | 'EST' | string) {
  const tz = timezone === 'PST' ? 'America/Los_Angeles' : 'America/New_York'

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: tz
    }).format(date)

  const today = new Date()
  const yesterday = new Date(today)

  yesterday.setDate(today.getDate() - 1)

  const lastWeekStart = new Date(today)

  lastWeekStart.setDate(today.getDate() - 7)

  const lastWeekEnd = today

  const custom = new Date(today)

  custom.setDate(today.getDate() - 7)

  return {
    today: formatDate(today),
    yesterday: formatDate(yesterday),
    lastweek: {
      from: formatDate(lastWeekStart),
      to: formatDate(lastWeekEnd)
    },
    custom: formatDate(custom)
  }
}
