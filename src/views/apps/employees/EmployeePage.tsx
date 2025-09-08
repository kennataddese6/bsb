'use client'

// React Imports
import { useSession } from 'next-auth/react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const EmployeePage = () => {
  const { data: session } = useSession()

  return (
    <Card>
      <CardContent className='flex flex-col items-center justify-center gap-6 p-12'>
        <Box className='flex flex-col items-center gap-4'>
          <CustomAvatar
            src={session?.user?.image || '/images/avatars/1.png'}
            alt={session?.user?.name || 'User'}
            size={80}
            className='shadow-lg'
          />
          <Box className='text-center'>
            <Typography variant='h4' className='mb-2'>
              Hello there!
            </Typography>
            <Typography variant='h6' color='text.secondary' className='mb-1'>
              Welcome back, {session?.user?.name || 'Employee'}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {session?.user?.email}
            </Typography>
          </Box>
        </Box>

        <Box className='text-center max-w-md'>
          <Typography variant='body1' color='text.secondary'>
            You are logged in as a regular user. Contact your administrator if you need access to additional features.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default EmployeePage
