import type { Employee } from '@/types/apps/employeeTypes'

export const employees: Employee[] = [
  {
    id: 1,
    fname: 'John',
    lname: 'Doe',
    email: 'john.doe@company.com',
    accountStatus: 'active',
    role: 'admin',
    avatar: '/images/avatars/1.png',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    fname: 'Jane',
    lname: 'Smith',
    email: 'jane.smith@company.com',
    accountStatus: 'active',
    role: 'user',
    avatar: '/images/avatars/2.png',
    createdAt: '2024-01-20'
  },
  {
    id: 3,
    fname: 'Mike',
    lname: 'Johnson',
    email: 'mike.johnson@company.com',
    accountStatus: 'active',
    role: 'user',
    avatar: '/images/avatars/3.png',
    createdAt: '2024-02-01'
  }
]
