'use client'
import { useSession } from 'next-auth/react'

const UserNameNavbar = () => {
  const { data: session, status } = useSession()

  const name = session?.user?.name || 'User Account'

  if (status === 'loading') {
    return <span className='text-base font-semibold text-muted-foreground animate-pulse'>Loading...</span>
  }

  return (
    <span
      className="
        text-base font-bold text-textPrimary
        tracking-wide
        select-none
        relative
        after:content-[''] after:absolute after:left-0 after:-bottom-1
        after:w-0 after:h-0.5 after:bg-primary
        hover:after:w-full after:transition-all after:duration-300
      "
    >
      {name}
    </span>
  )
}

export default UserNameNavbar
