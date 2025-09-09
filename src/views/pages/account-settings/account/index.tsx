// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import { getServerSession } from 'next-auth'

import AccountDetails from './AccountDetails'
import AccountDelete from './AccountDelete'
import { authOptions } from '@/libs/auth'

const Account = async () => {
  const session = await getServerSession(authOptions)

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AccountDetails user={session?.user} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <AccountDelete />
      </Grid>
    </Grid>
  )
}

export default Account
