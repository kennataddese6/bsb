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
 * Example usage:
 *
 * import { transformToQuarterlyData } from '@/utils/transformSalesData';
 * import salesData from '@/data/salesData.json';
 *
 * const quarterlySalesData = transformToQuarterlyData(salesData);
 * // Now you can use quarterlySalesData as needed
 */
