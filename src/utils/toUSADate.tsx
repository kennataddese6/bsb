export const toUSADate = (dateString: string, timeZone: string = 'America/New_York') => {
  const date = new Date(dateString)

  return date.toLocaleDateString('en-US', { timeZone })
}
