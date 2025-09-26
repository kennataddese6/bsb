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
    const response = await axios.get(`https://bsb.reportzon.com/families/${asin}?timeZone=${timezone}`)

    return response.data
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to items')
  }
}

export const getItemData = async (asin: string, timezone: string, startDate: Date | string, endDate: Date | string) => {
  try {
    const response = await axios.get(
      `https://bsb.reportzon.com/families/${asin}/data?timeZone=${timezone}&startDate=${startDate}&endDate=${endDate}`
    )

    return response.data
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to items')
  }
}
