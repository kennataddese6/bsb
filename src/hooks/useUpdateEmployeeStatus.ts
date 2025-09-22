import type { Employee } from '@/types/apps/employeeTypes'
import { updateEmployee } from '@/app/server/actions'

export const useUpdateEmployeeStatus = (
  setUpdatingEmployeeId: React.Dispatch<React.SetStateAction<number | null>>,
  setData: React.Dispatch<React.SetStateAction<Employee[]>>
) => {
  const updateEmployeeStatus = async (employee: Employee) => {
    const newStatus = employee.accountStatus === 'active' ? 'suspended' : 'active'

    setUpdatingEmployeeId(employee.id)

    try {
      const response = await updateEmployee({
        id: employee.id,
        account_status: newStatus
      })

      if (response.errorMessage) {
        throw new Error(response.errorMessage)
      }

      if (response) {
        // Update local state with the new status from response
        setData(prevData => prevData.map(emp => (emp.id === employee.id ? { ...emp, accountStatus: newStatus } : emp)))
      }

      return response
    } catch (error) {
      console.error('Error updating employee status:', error)

      // Revert the toggle if the API call fails
      setData(prevData => [...prevData])
      throw error
    } finally {
      setUpdatingEmployeeId(null)
    }
  }

  return { updateEmployeeStatus }
}
