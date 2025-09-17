// Shared date/time constants and helpers for charts and server actions

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const
export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const

/**
 * Generate an inclusive range of years as numbers.
 * Defaults to 2016..currentYear to match the sales report expectations.
 */
export function getYearRange(start: number = 2016, end: number = new Date().getFullYear()): number[] {
  const s = Math.min(start, end)
  const e = Math.max(start, end)
  const out: number[] = []

  for (let y = s; y <= e; y++) out.push(y)

  return out
}

/** Convert a list of numbers to their string equivalents. */
export function toYearStrings(years: number[]): string[] {
  return years.map(String)
}
