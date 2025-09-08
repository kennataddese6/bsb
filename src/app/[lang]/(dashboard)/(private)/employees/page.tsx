// Type Imports
import type { Locale } from '@configs/i18n'

// Component Imports
import EmployeesTable from '@views/apps/employees/EmployeesTable'
import RoleGuard from '@/hocs/RoleGuard'

const EmployeesPage = async ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const resolvedParams = await params

  return (
    <RoleGuard allowedRoles={['admin']} locale={resolvedParams.lang}>
      <EmployeesTable />
    </RoleGuard>
  )
}

export default EmployeesPage
