export type Employee = {
  id: number
  fname: string
  lname: string
  email: string
  role: 'admin' | 'user' | 'employee'
  accountStatus: 'active' | 'suspended'
  avatar?: string
  createdAt: string
}

export type EmployeeFormData = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'admin' | 'user' | 'employee'
}

export type EmployeeTypeWithAction = Employee & {
  action?: string
}

export type EditEmployeeFormData = {
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'user'
}

export type ChangePasswordFormData = {
  newPassword: string
  confirmPassword: string
}

export type PaginationData = {
  currentPage: number
  pageSize: number
  firstPage: number
  lastPage: number
  totalRecords: number
}
