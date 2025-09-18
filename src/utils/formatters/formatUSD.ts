// Utility to format numbers as USD currency string
const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export function formatUSD(amount: number | string | null | undefined): string {
  // Coerce to number safely
  const num = typeof amount === 'number' ? amount : Number(amount ?? 0)

  // If it's not a valid number, return formatted zero
  if (Number.isNaN(num)) {
    return usdFormatter.format(0)
  }

  return usdFormatter.format(num)
}
