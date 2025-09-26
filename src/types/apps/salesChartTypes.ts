export type ChartData = YearlyChartData | QuarterlyChartData

export interface BaseChartData {
  years: string[]
  salesData: Array<{
    year: string
    data: Array<{
      value: number
      [key: string]: any
    }>
  }>
  months?: string[]
  quarters?: string[]
}

export interface YearlyChartData extends BaseChartData {
  months: string[]
  salesData: Array<{
    year: string
    data: Array<{
      month: string
      value: number
    }>
  }>
}

export interface QuarterlyChartData extends BaseChartData {
  quarters: string[]
  salesData: Array<{
    year: string
    data: Array<{
      quarter: string
      value: number
    }>
  }>
}

export type Item = {
  Image: string
  Asin: string
  ParentAsin: string
  GroupName: string
  Variation: string
  TargetPrice: number
  TodayOrders: number
  YesterdayOrders: number
  Last7DaysOrders: number
  LastWeekOrders: number
  TodayAveragePrice: number
  deal?: boolean
}
