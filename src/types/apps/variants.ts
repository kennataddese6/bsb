export type Variant = {
  color: string
  hex: string
  size: string
  asin: string
  today: number
  ystd: number
  lastwk: number
  w7: number
  avg: number
  target: number
  deal: boolean
}

export type SelectedDates = {
  today: string
  yesterday: string
  lastweek: {
    from: string
    to: string
  }
  custom: string
}
export type Period = 'today' | 'yesterday' | 'lastweek' | 'custom'
