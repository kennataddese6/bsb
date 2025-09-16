'use client'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Styled Components
const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.default
}))

const ErrorCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  width: '100%',
  boxShadow: theme.shadows[6],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '& .MuiCardContent-root': {
    padding: theme.spacing(8),
    textAlign: 'center'
  }
}))

const ErrorIcon = styled('div')(({ theme }) => ({
  fontSize: '4rem',
  color: theme.palette.error.main,
  marginBottom: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
  '& i': {
    fontSize: 'inherit',
    color: 'inherit'
  }
}))

const ErrorPage = () => {
  const router = useRouter()

  return (
    <ErrorContainer>
      <ErrorCard>
        <CardContent>
          <ErrorIcon>
            <i className='bx bx-error-circle' />
          </ErrorIcon>
          <Typography variant='h4' component='h1' gutterBottom color='text.primary'>
            Oops, something went wrong!
          </Typography>
          <Typography variant='body1' color='text.secondary' paragraph sx={{ mb: 4 }}>
            We apologize for the inconvenience. Please try again or contact support if the problem persists.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant='contained'
              onClick={() => window.location.reload()}
              startIcon={<i className='bx bx-refresh' />}
              color='primary'
              sx={{ textTransform: 'none' }}
            >
              Refresh Page
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => router.push('/')}
              startIcon={<i className='bx bx-home' />}
              sx={{ textTransform: 'none' }}
            >
              Back to Home
            </Button>
          </Box>
        </CardContent>
      </ErrorCard>
    </ErrorContainer>
  )
}

export default ErrorPage
