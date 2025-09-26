'use client'
import axios from 'axios'

export const getFamilies = async () => {
  try {
    const response = await axios.get('https://bsb.reportzon.com/families')

    return response.data
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch employees')
  }
}
