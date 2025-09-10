'use server'

// Next.js Imports
import { getServerSession } from 'next-auth'

// Local Imports
import { authOptions } from '@/libs/auth'

export const uploadFile = async (file: File): Promise<{ url: string }> => {
  const session = await getServerSession(authOptions)
  const token = session?.accessToken

  const formData = new FormData()
  
  formData.append('file', file)

  try {
    const response = await fetch(`${process.env.BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload file')
    }

    return response.json()
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload file')
  }
}
