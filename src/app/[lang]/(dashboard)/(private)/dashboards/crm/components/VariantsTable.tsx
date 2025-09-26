import * as React from 'react'

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

import { formatUSD } from '@/utils/formatters/formatUSD'

export type Item = {
  Asin: string
  ParentAsin: string
  GroupName: string
  Variation: string
  TargetPrice: number
  TodayOrders: number
  YesterdayOrders: number
  Last7DaysOrders: number
  LastWeekOrders: number
  TodayAveragePrice: number
  deal?: boolean
}

type VariantsTableProps = {
  itemsData?: Item[]
  itemsLoading: boolean
  onSelect: (item: Item) => void
}

export function VariantsTable(props: VariantsTableProps): JSX.Element {
  const { itemsData, itemsLoading, onSelect } = props

  return (
    <Card>
      <CardHeader title='Variants & Performance' sx={{ pb: 2 }} />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
          <Box sx={{ maxHeight: 440, overflow: 'auto' }}>
            <Table stickyHeader size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Asin</TableCell>
                  <TableCell>Parent Asin</TableCell>
                  <TableCell>Variation</TableCell>
                  <TableCell align='right'>Target Price</TableCell>
                  <TableCell align='right'>Total Orders</TableCell>
                  <TableCell align='right'>Yesterday Orders</TableCell>
                  <TableCell align='right'>Last 7 Day Orders</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!itemsLoading &&
                  itemsData &&
                  itemsData.map(v => (
                    <TableRow hover key={v.Asin} onClick={() => onSelect(v)}>
                      <TableCell>{v.Asin}</TableCell>
                      <TableCell>
                        <Typography
                          component='span'
                          sx={{
                            fontFamily: 'ui-monospace, SFMono-Regular',
                            fontSize: 12,
                            color: 'text.secondary'
                          }}
                        >
                          {v.ParentAsin}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>{v.Variation}</TableCell>
                      <TableCell align='right'>{formatUSD(v.TargetPrice)}</TableCell>
                      <TableCell align='right'>{v.TodayOrders}</TableCell>
                      <TableCell align='right'>{v.YesterdayOrders}</TableCell>
                      <TableCell align='right'>{v.Last7DaysOrders}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
