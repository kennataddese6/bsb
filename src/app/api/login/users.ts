// ** Fake user data and data type

// ** Please remove below user data and data type in production and verify user with Real Database
export type UserTable = {
  id: number
  name: string
  email: string
  avatar: string
  password: string
  role?: 'admin' | 'user'
}

// =============== Fake Data ============================

export const users: UserTable[] = [
  {
    id: 1,
    name: 'John Doe',
    password: 'admin',
    email: 'admin@sneat.com',
    avatar: '/avatars/avatars/1.png',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Jane Smith',
    password: 'user123',
    email: 'jane.smith@company.com',
    avatar: '/avatars/avatars/2.png',
    role: 'user'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    password: 'user456',
    email: 'mike.johnson@company.com',
    avatar: '/images/avatars/3.png',
    role: 'user'
  }
]
