'use server'

// Next.js Imports
import { getServerSession } from 'next-auth'
import axios from 'axios'

// Local Imports
import { authOptions } from '@/libs/auth'

export const uploadFile = async (file: File): Promise<{ url: string }> => {
  const session = await getServerSession(authOptions)
  const token = session?.accessToken

  const formData = new FormData()

  formData.append('file', file)

  try {
    const response = await axios.post(`${process.env.BASE_URL}/users/upload-picture`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,

        // Let axios / browser set the correct multipart boundary
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error: any) {
    console.error('Error uploading file:', error?.response?.data || error.message || error)
    throw new Error('Failed to upload file')
  }
}
