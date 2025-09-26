'use client'
import axios from 'axios'

export const getFamilies = async () => {
  try {
    const response = await axios.get('https://bsb.reportzon.com/families')

    return response.data
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to families ')
  }
}

export const getItems = async (asin: string, timezone: string) => {
  try {
    const response = await axios.get(`https://bsb.reportzon.com/families/${asin}`, {
      params: { timeZone: timezone }
    })

    return response.data
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to items')
  }
}

export const getItemData = async (
  asin: string,
  timezone: string,
  startDate: Date | string,
  endDate: Date | string,
  isParent: boolean
) => {
  try {
    const formatApiDate = (d: Date | string): string => {
      if (typeof d === 'string') return d
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
      const year = d.getFullYear()
      const month = pad(d.getMonth() + 1)
      const day = pad(d.getDate())
      const hours = pad(d.getHours())
      const minutes = pad(d.getMinutes())

      return `${year}-${month}-${day}T${hours}:${minutes}:00`
    }

    const response = await axios.get(`https://bsb.reportzon.com/families/${asin}/data`, {
      params: {
        timeZone: timezone,
        startDate: formatApiDate(startDate),
        endDate: formatApiDate(endDate),
        isParent: isParent ? 'true' : 'false'
      }
    })

    return response.data
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to items')
  }
}
