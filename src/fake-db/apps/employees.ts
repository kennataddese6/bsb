import type { Employee } from '@/types/apps/employeeTypes'

export const employees: Employee[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    role: 'admin',
    avatar: '/images/avatars/1.png',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    role: 'user',
    avatar: '/images/avatars/2.png',
    createdAt: '2024-01-20'
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@company.com',
    role: 'user',
    avatar: '/images/avatars/3.png',
    createdAt: '2024-02-01'
  }
]
