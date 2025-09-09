// Type Imports
import type { Locale } from '@configs/i18n'

// Component Imports
import EmployeesTable from '@views/apps/employees/EmployeesTable'
import RoleGuard from '@/hocs/RoleGuard'
import { getEmployees } from '@/app/server/actions'

const EmployeesPage = async ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const resolvedParams = await params

  const employees = await getEmployees()

  return (
    <RoleGuard allowedRoles={['admin']} locale={resolvedParams.lang}>
      <EmployeesTable employees={employees} />
    </RoleGuard>
  )
}

export default EmployeesPage
