/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

// External Imports
import axios from 'axios'
import { getServerSession } from 'next-auth'

// Local Imports

import { authOptions } from '@/libs/auth'

// Fake Database Imports
import { db as eCommerceData } from '@/fake-db/apps/ecommerce'
import { db as academyData } from '@/fake-db/apps/academy'
import { db as vehicleData } from '@/fake-db/apps/logistics'
import { db as invoiceData } from '@/fake-db/apps/invoice'
import { db as userData } from '@/fake-db/apps/userList'
import { db as permissionData } from '@/fake-db/apps/permissions'
import { db as profileData } from '@/fake-db/pages/userProfile'
import { db as faqData } from '@/fake-db/pages/faq'
import { db as pricingData } from '@/fake-db/pages/pricing'
import { db as statisticsData } from '@/fake-db/pages/widgetExamples'
import { transformToQuarterlyData, normalizeToFullMonthlyData } from '@/utils/transformSalesData'
import { getYearRange, toYearStrings, MONTHS, QUARTERS } from '@/utils/dateConstants'

export const getSalesPerson = async (searchParams: { page?: string; size?: string }) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      throw new Error('Authentication required')
    }

    const response = await axios.get(`${process.env.BASE_URL}/salesperson`, {
      params: {
        pageSize: searchParams?.size || 200,
        page: searchParams?.page || 1,
        search: ''
      },
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    console.error('Error fetching employees:', error)

    throw new Error(error?.message || 'Failed to fetch employees')
  }
}

export const getSalesData = async (searchParams: { freq?: 'yearly' | 'quarterly' | undefined; sales?: string }) => {
  try {
    console.log('called', searchParams.freq)
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      throw new Error('Authentication required')
    }

    const years = getYearRange(2016)
    const yearsStr = toYearStrings(years)

    const months = [...MONTHS]

    const quarters = [...QUARTERS]

    const response = await axios.post(
      `${process.env.BASE_URL}/reports/sales`,
      { years: years, salesPerson: searchParams?.sales || '' },
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    // Normalize possibly null/undefined salesData from backend
    const rawSalesData = Array.isArray(response.data?.salesData) ? response.data.salesData : []

    // Normalize first to standardize month names and ensure missing months map to 0 and
    // Ensure each year's monthly data includes all 12 months in canonical order
    const normalizedMonthly = normalizeToFullMonthlyData(rawSalesData, months)

    if (searchParams?.freq === 'quarterly') {
      return { years: yearsStr, quarters, salesData: transformToQuarterlyData(normalizedMonthly) }
    }

    return { years: yearsStr, months, salesData: normalizedMonthly }
  } catch (error: any) {
    console.error('Error Sales Data:', error)

    throw new Error(error?.message || 'Failed to fetch Sales Data')
  }
}

export const getEmployees = async (searchParams: { page?: string; size?: string }) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      throw new Error('Authentication required')
    }

    const response = await axios.get(`${process.env.BASE_URL}/users`, {
      params: {
        page_size: searchParams?.size || 10,
        page: searchParams?.page || 1,
        sort_direction: 'desc'
      },
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    console.error('Error fetching employees:', error)

    throw new Error(error?.message || 'Failed to fetch employees')
  }
}

export const createEmployee = async (employee: any) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      throw new Error('Authentication required')
    }

    const response = await axios.post(`${process.env.BASE_URL}/users`, employee, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    console.error('Error creating employee:', error)

    throw new Error(error?.message || 'Failed to creating employee')
  }
}

export const updateEmployee = async (employee: any) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      throw new Error('Authentication required')
    }

    const response = await axios.patch(`${process.env.BASE_URL}/users/${employee.id}`, employee, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    console.error('Error updating employee:', error)

    throw new Error(error?.message || 'Error updating employee')
  }
}

export const updateProfile = async (employee: any) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      throw new Error('Authentication required')
    }

    const response = await axios.patch(`${process.env.BASE_URL}/users/profile/update`, employee, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    console.error('Error updating profile:', error)

    throw new Error(error?.message || 'Error updating profile')
  }
}

export const changePassword = async (employee: any) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      throw new Error('Authentication required')
    }

    const response = await axios.put(`${process.env.BASE_URL}/users/change-password`, employee, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    console.error('Error changing password:', error)

    throw new Error(error?.message || 'Error changing password')
  }
}

export const resetPassword = async (employee: any) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      throw new Error('Authentication required')
    }

    const response = await axios.put(`${process.env.BASE_URL}/users/profile/reset-password`, employee, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    console.error('Error changing password:', error)

    throw new Error(error?.message || 'Error changing password')
  }
}

export const getEcommerceData = async () => {
  return eCommerceData
}

export const getAcademyData = async () => {
  return academyData
}

export const getLogisticsData = async () => {
  return vehicleData
}

export const getInvoiceData = async () => {
  return invoiceData
}

export const getUserData = async () => {
  return userData
}

export const getPermissionsData = async () => {
  return permissionData
}

export const getProfileData = async () => {
  return profileData
}

export const getFaqData = async () => {
  return faqData
}

export const getPricingData = async () => {
  return pricingData
}

export const getStatisticsData = async () => {
  return statisticsData
}
