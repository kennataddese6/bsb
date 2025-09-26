import * as React from 'react'

import { Card, CardContent, Grid2 as Grid, Stack, Typography } from '@mui/material'

type PpcAndDealProps = {
  ppcSpent: string
  dealTitle: string
}

export function PpcAndDeal(props: PpcAndDealProps): JSX.Element {
  const { ppcSpent, dealTitle } = props

  return (
    <>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          <CardContent>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Typography color='text.secondary'>PPC Spent</Typography>
              <i className={'bx-bullseye'} />
            </Stack>
            <Typography variant='h4' sx={{ mt: 2, fontWeight: 700 }}>
              {ppcSpent}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <CardContent>
            <Stack alignItems='center' spacing={1}>
              <i className={'bx-check-circle'} />
              <Typography variant='h6' sx={{ fontWeight: 700 }}>
                {dealTitle}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}
