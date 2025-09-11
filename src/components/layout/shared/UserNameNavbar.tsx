'use client'
import { useSession } from 'next-auth/react'

const UserNameNavbar = () => {
  const { data: session } = useSession()

  return (
    <div className='flex items-center gap-2 border border-border rounded-lg px-3 py-1.5'>
      <span className='text-sm font-medium text-textPrimary'>{session?.user?.name || 'User Account'}</span>
    </div>
  )
}

export default UserNameNavbar
