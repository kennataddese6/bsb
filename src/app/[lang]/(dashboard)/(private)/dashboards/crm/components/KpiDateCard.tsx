import * as React from 'react'

import { Button, Card, CardContent, IconButton, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

import type { Period } from '@/types/apps/variants'
import { getItemData } from '@/hooks/fetches'

type ItemMetrics = { TotalUnits: number; TotalOrders: number }

type KpiDateCardProps = {
  period: Period
  labelText: string
  fromISO: string
  toISO: string
  timezone: 'PST' | 'EST'
  family: string | null
  parentItemAsin?: string | null
  onOpenDate: () => void
}

export function KpiDateCard(props: KpiDateCardProps): JSX.Element {
  const { period, labelText, fromISO, toISO, timezone, family, parentItemAsin, onOpenDate } = props

  const tz = timezone === 'PST' ? 'America/Los_Angeles' : 'America/New_York'

  const { data, isLoading } = useQuery<ItemMetrics | null>({
    queryKey: ['kpi', period, family, parentItemAsin ?? null, tz, fromISO, toISO],
    queryFn: () => getItemData(family as string, tz, fromISO, toISO),
    enabled: Boolean(family),
    staleTime: 5000
  })

  return (
    <Card>
      <CardContent>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <div style={{ minWidth: 0, flex: 1 }}>
            <Button
              variant='text'
              onClick={onOpenDate}
              style={{ padding: 0, minHeight: 'auto', textAlign: 'left', justifyContent: 'flex-start' }}
              sx={{ '&:hover': { bgcolor: 'transparent' } }}
            >
              <Typography variant='caption' color='text.secondary' noWrap>
                {labelText}{' '}
              </Typography>
            </Button>
            {isLoading ? (
              <>
                <div className='animate-spin my-2 rounded-full h-4 w-4 border-b-2 border-primary'></div>
                <Typography variant='caption' color='text.secondary'>
                  Units / Orders
                </Typography>
              </>
            ) : (
              <>
                <Typography variant='h5' sx={{ mt: 1, color: 'primary.main', fontWeight: 700 }}>
                  {data && data?.TotalUnits}/{data?.TotalOrders}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Units / Orders
                </Typography>
              </>
            )}
          </div>

          <IconButton
            aria-label={`Select date for ${period}`}
            onClick={onOpenDate}
            size='small'
            sx={{ ml: 1, flexShrink: 0 }}
          >
            <i className='bx-calendar' />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  )
}
