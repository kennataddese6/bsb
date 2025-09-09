// Type Imports
import { getServerSession } from 'next-auth'

import type { Locale } from '@configs/i18n'

// Component Imports
import EmployeesTable from '@views/apps/employees/EmployeesTable'
import RoleGuard from '@/hocs/RoleGuard'
import { getEmployees } from '@/app/server/actions'
import { authOptions } from '@/libs/auth'
import EmployeesTableAdminView from '@/views/apps/employees/EmployeesTableAdminView'

const EmployeesPage = async ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const resolvedParams = await params

  const employees = await getEmployees()
  const session = await getServerSession(authOptions)
  const user = session?.user

  return user?.role === 'admin' ? (
    <RoleGuard allowedRoles={['admin']} locale={resolvedParams.lang}>
      <EmployeesTableAdminView employees={employees} />
    </RoleGuard>
  ) : (
    <EmployeesTable employees={employees} />
  )
}

export default EmployeesPage
