'use server'

// External Imports
import axios from 'axios'
import { getServerSession } from 'next-auth'

// Local Imports

import { authOptions } from '@/libs/auth'

import { transformToQuarterlyData, normalizeToFullMonthlyData } from '@/utils/transformSalesData'
import { getYearRange, toYearStrings, MONTHS, QUARTERS } from '@/utils/dateConstants'
import type { Employee } from '@/types/apps/employeeTypes'
import { getYearsInRange } from '@/utils/get-years-in-range'

export const getSalesPerson = async (searchParams?: { page?: string; size?: string }) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      throw new Error('Authentication required')
    }

    const response = await axios.get(`${process.env.BASE_URL}/salesperson`, {
      params: {
        pageSize: searchParams?.size || 10,
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
    throw new Error(error?.message || 'Failed to fetch employees')
  }
}

export const getSalesData = async (searchParams: { freq?: 'yearly' | 'quarterly' | undefined; sales?: string }) => {
  try {
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
    throw new Error(error?.message || 'Failed to fetch Sales Data')
  }
}

export const getSalesDataClient = async (freq: string, sales: string, startDate: Date, endDate: Date) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      throw new Error('Authentication required')
    }

    const yearInRange = getYearsInRange(startDate.getFullYear(), endDate.getFullYear())

    const yearsStr = toYearStrings(yearInRange)

    const months = [...MONTHS]

    const quarters = [...QUARTERS]

    const response = await axios.post(
      `${process.env.BASE_URL}/reports/sales`,
      { years: yearInRange, salesPerson: sales || '' },
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

    if (freq === 'quarterly') {
      return { years: yearsStr, quarters, salesData: transformToQuarterlyData(normalizedMonthly) }
    }

    return { years: yearsStr, months, salesData: normalizedMonthly }
  } catch (error: any) {
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
    throw new Error(error?.message || 'Failed to fetch employees')
  }
}

export const createEmployee = async (employee: Omit<Employee, 'id' | 'accountStatus' | 'createdAt'>) => {
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
    throw new Error(error?.response?.data?.error || 'Failed to creating employee')
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
    throw new Error(error?.response?.data?.error || error?.message || 'Error updating employee')
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
    throw new Error(error?.response?.data?.error || error?.message || 'Error updating profile')
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
    throw new Error(error?.response?.data?.error || error?.message || 'Error changing password')
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
    throw new Error(error?.response?.data?.error || error?.message || 'Error changing password')
  }
}
