export const getRelativeDayLabel = (date: string): 'Today ·' | 'Yesterday ·' | 'Last week ·' | '' => {
  const today = new Date()

  const yesterday = new Date(today)

  yesterday.setDate(today.getDate() - 1)

  const lastWeek = new Date(today)

  return date == today.toLocaleDateString()
    ? 'Today ·'
    : date == yesterday.toLocaleDateString()
      ? 'Yesterday ·'
      : date == lastWeek.toLocaleDateString()
        ? 'Last week ·'
        : ''
}
