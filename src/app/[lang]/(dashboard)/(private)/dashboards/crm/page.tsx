'use client'

import * as React from 'react'

import Image from 'next/image'

import {
  Box,
  Grid2 as Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material'

type Variant = {
  color: string
  hex: string
  size: string
  asin: string
  today: number
  ystd: number
  lastwk: number
  w7: number
  avg: number
  target: number
  deal: boolean
}

const variants: Variant[] = [
  {
    color: 'Blue',
    hex: '#2b6cb0',
    size: '9 ft',
    asin: 'B01KNKFTPC',
    today: 905,
    ystd: 413,
    lastwk: 544,
    w7: 845,
    avg: 16.99,
    target: 17.99,
    deal: true
  },
  {
    color: 'Red',
    hex: '#e53e3e',
    size: '9 ft',
    asin: 'B01KKNQ004',
    today: 520,
    ystd: 455,
    lastwk: 652,
    w7: 555,
    avg: 15.89,
    target: 19.99,
    deal: false
  },
  {
    color: 'White',
    hex: '#e2e8f0',
    size: '7 ft',
    asin: 'B01KNKFTPC',
    today: 455,
    ystd: 787,
    lastwk: 454,
    w7: 545,
    avg: 16.99,
    target: 17.99,
    deal: false
  },
  {
    color: 'Green',
    hex: '#38a169',
    size: '7 ft',
    asin: 'B01KKNQ004',
    today: 564,
    ystd: 652,
    lastwk: 555,
    w7: 655,
    avg: 15.89,
    target: 17.99,
    deal: true
  },
  {
    color: 'Yellow',
    hex: '#ecc94b',
    size: '9 ft',
    asin: 'B01KKNQ004',
    today: 471,
    ystd: 845,
    lastwk: 544,
    w7: 559,
    avg: 15.89,
    target: 17.99,
    deal: false
  },
  {
    color: 'Black',
    hex: '#1a202c',
    size: '9 ft',
    asin: 'B01KKNQ004',
    today: 584,
    ystd: 413,
    lastwk: 454,
    w7: 659,
    avg: 15.89,
    target: 17.99,
    deal: false
  },
  {
    color: 'Green',
    hex: '#38a169',
    size: '9 ft',
    asin: 'B01KKNQ004',
    today: 548,
    ystd: 452,
    lastwk: 655,
    w7: 565,
    avg: 15.89,
    target: 17.99,
    deal: false
  },
  {
    color: 'Black',
    hex: '#1a202c',
    size: '9 ft',
    asin: 'B01KKNQ004',
    today: 555,
    ystd: 845,
    lastwk: 454,
    w7: 545,
    avg: 15.89,
    target: 17.99,
    deal: true
  }
]

export default function Page() {
  const target = 7000
  const actual = 5015
  const maxScale = 9000 // for the background bar
  const [datePickerOpen, setDatePickerOpen] = React.useState<string | null>(null)

  const [selectedDates, setSelectedDates] = React.useState<{ [key: string]: string }>({
    today: '9/1/25',
    yesterday: '8/30/25',
    lastweek: '8/25/25',
    custom: '8/25/25'
  })

  const handleDateClick = (period: string) => {
    setDatePickerOpen(period)
  }

  const handleDateClose = () => {
    setDatePickerOpen(null)
  }

  const handleDateSelect = (period: string, date: string) => {
    setSelectedDates(prev => ({ ...prev, [period]: date }))
    setDatePickerOpen(null)
  }

  return (
    <Box
      sx={{
        p: { xs: 4, md: 6 },
        bgcolor: 'background.default',
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(145deg, #f8f9ff 0%, #ffffff 40%, #f8f9ff 100%)'
      }}
    >
      {/* Header */}
      <Grid container spacing={4} alignItems='center' sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack direction='row' spacing={3} alignItems='center'>
            <Box
              sx={{ position: 'relative', width: 112, height: 112, borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}
            >
              <Image src='/images/cards/5.png' alt='Tree Bag' fill style={{ objectFit: 'cover' }} />
            </Box>
            <Box>
              <Typography variant='caption' color='text.secondary'>
                ASIN
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 600, lineHeight: 1.2, mb: 0.5 }}>
                SJD FHO DFD
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500 }}>
                Tree Bag · Plastic
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack direction='row' spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
            <Button variant='outlined' startIcon={<i className={'bx-calendar'} />}>
              Default Dates
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Main Grid */}
      <Grid container spacing={4}>
        {/* LEFT: Variants & Performance */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card>
            <CardHeader title='Variants & Performance' sx={{ pb: 2 }} />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
                <Box sx={{ maxHeight: 440, overflow: 'auto' }}>
                  <Table stickyHeader size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Color</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>ASIN</TableCell>
                        <TableCell align='right'>Today</TableCell>
                        <TableCell align='right'>Ystd</TableCell>
                        <TableCell align='right'>Last wk</TableCell>
                        <TableCell align='right'>7 days</TableCell>
                        <TableCell align='right'>Avg $</TableCell>
                        <TableCell align='right'>Target $</TableCell>
                        <TableCell align='center'>Deal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {variants.map((v, i) => (
                        <TableRow hover key={i}>
                          <TableCell>
                            <Stack direction='row' spacing={1} alignItems='center'>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: v.hex,
                                  border: '1px solid rgba(0,0,0,.1)'
                                }}
                              />
                              <Typography>{v.color}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{v.size}</TableCell>
                          <TableCell>
                            <Typography
                              component='span'
                              sx={{ fontFamily: 'ui-monospace, SFMono-Regular', fontSize: 12, color: 'text.secondary' }}
                            >
                              {v.asin}
                            </Typography>
                          </TableCell>
                          <TableCell align='right'>{v.today.toLocaleString()}</TableCell>
                          <TableCell align='right'>{v.ystd.toLocaleString()}</TableCell>
                          <TableCell align='right'>{v.lastwk.toLocaleString()}</TableCell>
                          <TableCell align='right'>{v.w7.toLocaleString()}</TableCell>
                          <TableCell align='right'>${v.avg.toFixed(2)}</TableCell>
                          <TableCell align='right'>${v.target.toFixed(2)}</TableCell>
                          <TableCell align='center'>
                            {v.deal ? (
                              <Chip icon={<i className={'bx-gift'} />} label='Deal' size='small' color='success' />
                            ) : (
                              <Typography color='text.disabled'>—</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT: KPIs & Progress */}
        <Grid size={{ xs: 12, lg: 7 }}>
          {/* KPI Tiles */}
          <Grid container spacing={4}>
            {[
              {
                label: `Today · ${selectedDates.today} 3:48pm`,
                value: '15 / 13',
                icon: <i className={'bx-calendar'} />,
                period: 'today'
              },
              {
                label: `Yesterday · ${selectedDates.yesterday}`,
                value: '13 / 13',
                icon: <i className={'bx-calendar'} />,
                period: 'yesterday'
              },
              {
                label: `Last week · ${selectedDates.lastweek}`,
                value: '28 / 25',
                icon: <i className={'bx-calendar'} />,
                period: 'lastweek'
              },
              {
                label: `Custom · ${selectedDates.custom}`,
                value: '28 / 25',
                icon: <i className={'bx-calendar'} />,
                period: 'custom'
              }
            ].map((k, idx) => (
              <Grid key={idx} size={{ xs: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
                      <Box>
                        <Button
                          variant='text'
                          onClick={() => handleDateClick(k.period)}
                          sx={{
                            p: 0,
                            minHeight: 'auto',
                            textAlign: 'left',
                            justifyContent: 'flex-start',
                            '&:hover': { bgcolor: 'transparent' }
                          }}
                        >
                          <Typography variant='caption' color='text.secondary'>
                            {k.label}
                          </Typography>
                        </Button>
                        <Typography variant='h5' sx={{ mt: 1, color: 'primary.main', fontWeight: 700 }}>
                          {k.value}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Units / Orders
                        </Typography>
                      </Box>
                      {k.icon}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Prices */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              { label: 'Today’s Price', value: '$44.99', icon: <i className={'bx-dollar-circle'} /> },
              { label: 'Average Price', value: '$48.65', icon: <i className={'bx-trending-up'} /> },
              { label: 'Target Price', value: '$49.99', icon: <i className={'bx-target-lock'} /> }
            ].map((p, idx) => (
              <Grid key={idx} size={{ xs: 12, md: 4 }}>
                <Card>
                  <CardContent>
                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                      <Typography color='text.secondary'>{p.label}</Typography>
                      {p.icon}
                    </Stack>
                    <Typography variant='h4' sx={{ mt: 2, fontWeight: 700 }}>
                      {p.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Totals */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              { label: 'Total ordered', value: '20,000' },
              { label: 'Total Sold', value: '5,015' },
              { label: 'To be sold', value: '14,985' }
            ].map((t, idx) => (
              <Grid key={idx} size={{ xs: 12, md: 4 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography color='text.secondary'>{t.label}</Typography>
                    <Typography variant='h4' sx={{ mt: 1, fontWeight: 700 }}>
                      {t.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Target vs Actual */}
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
              {/* background = full scale, first bar = target, second = actual */}
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

          {/* PPC + Deal */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card>
                <CardContent>
                  <Stack direction='row' justifyContent='space-between' alignItems='center'>
                    <Typography color='text.secondary'>PPC Spent</Typography>
                    <i className={'bx-bullseye'} />
                  </Stack>
                  <Typography variant='h4' sx={{ mt: 2, fontWeight: 700 }}>
                    $2,548
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
                      Deal Running
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ my: 6 }} />
      <Typography variant='caption' color='text.disabled'>
        *Demo data. Replace with live values from your API/Sheet.
      </Typography>

      {/* Date Picker Dialog */}
      <Dialog open={!!datePickerOpen} onClose={handleDateClose} maxWidth='xs' fullWidth>
        <DialogTitle>Select Date {datePickerOpen && `for ${datePickerOpen}`}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Date (MM/DD/YY)'
            type='text'
            fullWidth
            variant='outlined'
            placeholder='e.g., 9/1/25'
            defaultValue={datePickerOpen ? selectedDates[datePickerOpen] : ''}
            onKeyPress={e => {
              if (e.key === 'Enter' && datePickerOpen) {
                handleDateSelect(datePickerOpen, (e.target as HTMLInputElement).value)
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDateClose}>Cancel</Button>
          <Button
            onClick={e => {
              if (datePickerOpen) {
                const input = e.currentTarget.closest('.MuiDialog-root')?.querySelector('input')

                if (input) {
                  handleDateSelect(datePickerOpen, input.value)
                }
              }
            }}
            variant='contained'
          >
            Select
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
