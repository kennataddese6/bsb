'use client'

// React Imports
import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import EmployeePage from '@views/apps/employees/EmployeePage'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

type Props = ChildrenType & {
  allowedRoles: ('admin' | 'user')[]
  locale: Locale
}

const RoleGuard = ({ children, allowedRoles, locale }: Props) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      // Not authenticated, redirect to login
      router.replace(getLocalizedUrl('/login', locale))

      return
    }

    const userRole = session.user?.role as 'admin' | 'user' | undefined

    if (!userRole || !allowedRoles.includes(userRole)) {
      // User doesn't have required role, redirect to employee page
      router.replace(getLocalizedUrl('/employee-page', locale))

      return
    }
  }, [session, status, allowedRoles, locale, router])

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
      </div>
    )
  }

  // If not authenticated or doesn't have required role, show employee page
  if (!session || !session.user?.role || !allowedRoles.includes(session.user.role as 'admin' | 'user')) {
    return <EmployeePage />
  }

  // User has required role, show protected content
  return <>{children}</>
}

export default RoleGuard
