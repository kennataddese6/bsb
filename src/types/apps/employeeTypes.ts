export type Employee = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'user'
  avatar?: string
  createdAt: string
}

export type EmployeeFormData = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'admin' | 'user'
}
