import { MONTHS as DEFAULT_MONTHS } from '@/utils/dateConstants'

interface MonthlyData {
  month: string
  value: number
}

interface YearlyData {
  year: string
  data: MonthlyData[]
}

interface QuarterlyDataPoint {
  quarter: string
  value: number
}

interface QuarterlyYearData {
  year: string
  data: QuarterlyDataPoint[]
}

interface MonthlyDataPoint {
  month: string
  value: number
}

interface YearlyData {
  year: string
  data: MonthlyDataPoint[]
}

interface QuarterlyDataPoint {
  quarter: string
  value: number
}

interface QuarterlyYearData {
  year: string
  data: QuarterlyDataPoint[]
}

type SalesData = YearlyData[]
type QuarterlySalesData = QuarterlyYearData[]

/**
 * Transforms monthly sales data into quarterly sales data by summing values for each quarter
 * @param yearlyData - The input sales data with monthly breakdown
 * @returns Quarterly sales data with Q1-Q4 totals
 */
export function transformToQuarterlyData(yearlyData: SalesData): QuarterlySalesData {
  // Sort the years to ensure they're in order
  const sortedYearlyData = [...yearlyData].sort((a, b) => parseInt(a.year) - parseInt(b.year))
  const quarterlyData: QuarterlySalesData = []

  // Map of month to quarter (supports short/long and case-insensitive keys)
  const monthToQuarter: { [key: string]: string } = {
    jan: 'Q1',
    janruary: 'Q1',
    january: 'Q1',
    Jan: 'Q1',
    January: 'Q1',
    feb: 'Q1',
    february: 'Q1',
    Feb: 'Q1',
    February: 'Q1',
    mar: 'Q1',
    march: 'Q1',
    Mar: 'Q1',
    March: 'Q1',
    apr: 'Q2',
    april: 'Q2',
    Apr: 'Q2',
    April: 'Q2',
    may: 'Q2',
    May: 'Q2',
    jun: 'Q2',
    june: 'Q2',
    Jun: 'Q2',
    June: 'Q2',
    jul: 'Q3',
    july: 'Q3',
    Jul: 'Q3',
    July: 'Q3',
    aug: 'Q3',
    august: 'Q3',
    Aug: 'Q3',
    August: 'Q3',
    sep: 'Q3',
    sept: 'Q3',
    september: 'Q3',
    Sep: 'Q3',
    Sept: 'Q3',
    September: 'Q3',
    oct: 'Q4',
    october: 'Q4',
    Oct: 'Q4',
    October: 'Q4',
    nov: 'Q4',
    november: 'Q4',
    Nov: 'Q4',
    November: 'Q4',
    dec: 'Q4',
    december: 'Q4',
    Dec: 'Q4',
    December: 'Q4'
  }

  // Process each year's data
  for (const yearData of sortedYearlyData) {
    const quarterlySums: { [key: string]: number } = {
      Q1: 0,
      Q2: 0,
      Q3: 0,
      Q4: 0
    }

    // Sum up values by quarter
    for (const monthData of yearData.data) {
      const monthKey = typeof monthData.month === 'string' ? monthData.month : ''
      const quarter = monthToQuarter[monthKey] || monthToQuarter[monthKey.toLowerCase?.() || '']

      // Coerce value to number safely
      const rawVal: unknown = (monthData as any).value
      const numericVal = typeof rawVal === 'number' ? rawVal : Number(String(rawVal))

      if (quarter && Number.isFinite(numericVal)) {
        quarterlySums[quarter] += numericVal
      }
    }

    // Convert sums to the expected format (ensure numbers)
    const quarterlyTotals: QuarterlyDataPoint[] = Object.entries(quarterlySums).map(([quarter, sum]) => ({
      quarter,
      value: Number.isFinite(sum) ? Math.round(sum * 10) / 10 : 0
    }))

    quarterlyData.push({
      year: yearData.year,
      data: quarterlyTotals
    })
  }

  return quarterlyData
}

/**
 * Normalize yearly monthly data to ensure each year has all 12 months present in
 * canonical order (Jan..Dec). Missing months are added with value 0. Month name
 * matching is case-insensitive and supports both short ("Jan") and long ("January") names.
 */
export function normalizeToFullMonthlyData(yearlyData: SalesData, months: readonly string[] = DEFAULT_MONTHS): SalesData {
  // Build a resolver that maps various representations to the canonical month index
  const monthIndexByKey = new Map<string, number>()

  const longNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  months.forEach((m, idx) => {
    monthIndexByKey.set(m.toLowerCase(), idx)
    const long = longNames[idx]

    monthIndexByKey.set(long.toLowerCase(), idx)
  })

  const toIndex = (raw: string | unknown): number | undefined => {
    if (typeof raw !== 'string') return undefined
    const key = raw.toLowerCase()

    if (monthIndexByKey.has(key)) return monthIndexByKey.get(key)
    
    // Also try first 3 chars as a short form if not already a match
    const short = key.slice(0, 3)

    return monthIndexByKey.get(short)
  }

  const normalized: SalesData = []

  for (const year of yearlyData || []) {
    const values = new Array<number>(months.length).fill(0)

    for (const md of year?.data || []) {
      const idx = toIndex((md as any)?.month)
      const rawVal: unknown = (md as any)?.value
      const n = typeof rawVal === 'number' ? rawVal : Number(String(rawVal))

      if (idx != null && Number.isFinite(n)) {
        // If duplicates exist for a month, sum them
        values[idx] += n
      }
    }

    const data: MonthlyData[] = months.map((m, i) => ({ month: m, value: values[i] }))

    normalized.push({ year: String(year.year), data })
  }

  // Sort by year ascending to keep consistent order
  normalized.sort((a, b) => parseInt(String(a.year), 10) - parseInt(String(b.year), 10))

  return normalized
}

/**
 * Example usage:
 *
 * import { transformToQuarterlyData } from '@/utils/transformSalesData';
 * import salesData from '@/data/salesData.json';
 *
 * const quarterlySalesData = transformToQuarterlyData(salesData);
 * // Now you can use quarterlySalesData as needed
 */
