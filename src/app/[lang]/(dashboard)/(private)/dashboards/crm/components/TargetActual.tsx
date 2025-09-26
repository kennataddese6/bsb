import * as React from 'react'

import { Box, Card, CardContent, CardHeader, LinearProgress, Stack, Typography } from '@mui/material'

type TargetActualProps = {
  target: number
  actual: number
  maxScale?: number
}

export function TargetActual(props: TargetActualProps): JSX.Element {
  const { target, actual, maxScale = 9000 } = props

  return (
    <Card sx={{ mt: 0 }}>
      <CardHeader title='Target vs Actual' sx={{ pb: 2 }} />
      <CardContent>
        <Stack direction='row' justifyContent='space-between' sx={{ mb: 1 }}>
          <Typography variant='caption' color='text.secondary'>
            Target: {target.toLocaleString()}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            Actual: {actual.toLocaleString()}
          </Typography>
        </Stack>

        <Box sx={{ position: 'relative' }}>
          <LinearProgress
            variant='determinate'
            value={100}
            sx={{ height: 14, borderRadius: 999, bgcolor: 'grey.200' }}
          />
          <LinearProgress
            variant='determinate'
            value={(target / maxScale) * 100}
            sx={{
              height: 14,
              borderRadius: 999,
              position: 'absolute',
              inset: 0,
              '& .MuiLinearProgress-bar': { bgcolor: 'secondary.light' }
            }}
          />
          <LinearProgress
            variant='determinate'
            value={(actual / maxScale) * 100}
            sx={{
              height: 14,
              borderRadius: 999,
              position: 'absolute',
              inset: 0,
              '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' }
            }}
          />
        </Box>

        <Stack direction='row' justifyContent='space-between' sx={{ mt: 0.5 }}>
          <Typography variant='caption' color='text.secondary'>
            0
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            2,000
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            7,000
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            9,000
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}
