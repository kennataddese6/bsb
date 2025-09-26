'use client'

import { useState } from 'react'

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  Switch
} from '@mui/material'

import { formatUSD } from '@/utils/formatters/formatUSD'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import { defaultDate } from '@/utils/defaultDate'
import { variants } from '@/data/variantsData'
import type { Period, SelectedDates } from '@/types/apps/variants'
import { getRelativeDayLabel } from '@/utils/relativeDayLabel'

function parseFlexibleDate(s: string | undefined): Date {
  if (!s) return new Date()
  const parts = s.split('/').map(p => p.trim())

  if (parts.length >= 3) {
    const m = Number(parts[0])
    const d = Number(parts[1])
    let y = Number(parts[2])

    if (parts[2].length === 2) {
      y = y + (y < 70 ? 2000 : 1900)
    }

    const dt = new Date(y, m - 1, d)

    if (!isNaN(dt.getTime())) return dt
  }

  const dt2 = new Date(s)

  if (!isNaN(dt2.getTime())) return dt2

  return new Date()
}

/** Format date to "M/D/YY" like your original strings (9/1/25)  hh and mm*/
function formatToShortDate(d: Date | null): string {
  if (!d) return ''

  const mm = d.getMonth() + 1
  const dd = d.getDate()
  const yy = d.getFullYear()

  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')

  return `${mm}/${dd}/${yy} ${hours}:${minutes}`
}

function formatForDatetimeLocal(d: Date | null): string {
  if (!d) return ''
  const pad = (n: number) => n.toString().padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const min = pad(d.getMinutes())

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

/* ----------------------------- Page ------------------------------ */
export default function Page(): JSX.Element {
  const target = 7000
  const actual = 5015
  const maxScale = 9000 // for the background bar

  const [datePickerOpen, setDatePickerOpen] = React.useState<Period | null>(null)

  // temporary date shown inside the inline picker before confirmation
  const [tempDate, setTempDate] = React.useState<Date | null>(null)
  const [timezone, setTimezone] = React.useState('PST')
  const [period, setPeriod] = useState('today')
  const [allFamilySelected, selectAllFamily] = useState(false)
  const [tempFromDate, setTempFromDate] = useState<Date | null>(null)

  const currentTime = useCurrentTime(timezone)
  const currentTimeWithoutSeconds = useCurrentTime(timezone, false)

  const [selectedDates, setSelectedDates] = React.useState<SelectedDates>(defaultDate(timezone))

  const setDefaultDates = () => {
    setSelectedDates(defaultDate(timezone))
  }

  /* Open dialog and seed the tempDate from selectedDates */
  const handleDateClick = (period: Period) => {
    setPeriod(period)
    setDatePickerOpen(period)
    setTempDate(parseFlexibleDate(selectedDates[period]))
  }

  const handleDateClose = () => {
    setDatePickerOpen(null)
    setTempDate(null)
  }

  const handleDateSelect = (period: Period | null, date: Date | null) => {
    if (!period) return
    const formatted = date ? formatToShortDate(date) : selectedDates[period]

    setSelectedDates(prev => ({ ...prev, [period]: formatted }))
    setDatePickerOpen(null)
    setTempDate(null)
  }

  const defaultDates = defaultDate(timezone)

  /* KPI tiles array typed with Period */
  const tiles: { label: string; value: string; period: Period }[] = [
    {
      label: `${getRelativeDayLabel(selectedDates.today)}  ${selectedDates.today} ${defaultDates.today === selectedDates.today ? currentTimeWithoutSeconds : ''}`,
      value: '15 / 13',
      period: 'today'
    },
    {
      label: `${getRelativeDayLabel(selectedDates.yesterday)}  ${selectedDates.yesterday}  ${defaultDates.yesterday === selectedDates.yesterday ? currentTimeWithoutSeconds : ''}`,
      value: '13 / 13',
      period: 'yesterday'
    },
    {
      label: `${getRelativeDayLabel(selectedDates.lastweek.from)}  ${selectedDates.lastweek.from} `,
      value: '28 / 25',
      period: 'lastweek'
    },
    {
      label: `Custom · ${selectedDates.custom} `,
      value: '28 / 25',
      period: 'custom'
    }
  ]

  return (
    <Box
      sx={{
        p: { xs: 4, md: 6 },
        bgcolor: 'white',
        minHeight: '100vh'
      }}
    >
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
            <Autocomplete
              disablePortal
              options={['Family Asin 1', 'Family Asin 2', 'Family Asin 3']}
              sx={{ width: 300 }}
              renderInput={params => <TextField {...params} label='Select Family' />}
            />
            <div className='flex items-center justify-between ml-12'>
              <label className='font-medium cursor-pointer' htmlFor='customizer-semi-dark'>
                All Family
              </label>
              <Switch
                id='customizer-semi-dark'
                onChange={() => selectAllFamily(!allFamilySelected)}
                checked={allFamilySelected}
              />
            </div>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack direction='row' spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
            <Stack direction='row' spacing={2} alignItems='center'>
              <ToggleButtonGroup
                value={timezone}
                exclusive
                onChange={(e, newTimezone) => {
                  if (newTimezone) setTimezone(newTimezone)
                }}
              >
                <ToggleButton
                  value='PST'
                  sx={{
                    bgcolor: '#E3F2FD',
                    color: 'black',
                    '&.Mui-selected': { bgcolor: '#1E88E5', color: 'white', '&:hover': { bgcolor: '#1565C0' } },
                    '&:hover': { bgcolor: '#BBDEFB' }
                  }}
                >
                  PST
                </ToggleButton>

                <ToggleButton
                  value='EST'
                  sx={{
                    bgcolor: '#E8F5E9',
                    color: 'black',
                    '&.Mui-selected': { bgcolor: '#43A047', color: 'white', '&:hover': { bgcolor: '#2E7D32' } },
                    '&:hover': { bgcolor: '#C8E6C9' }
                  }}
                >
                  EST
                </ToggleButton>
              </ToggleButtonGroup>

              <Typography variant='body1' sx={{ fontFamily: 'monospace', minWidth: '80px' }}>
                {currentTime}
              </Typography>
            </Stack>
            <Button variant='text' startIcon={<i className={'bx-calendar'} />} onClick={() => setDefaultDates()}>
              Default Dates
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
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
                          <TableCell align='right'>{formatUSD(v.avg)}</TableCell>
                          <TableCell align='right'>{formatUSD(v.target)}</TableCell>
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

        <Grid size={{ xs: 12, lg: 7 }}>
          {/* KPI Tiles */}
          <Grid container spacing={4}>
            {tiles.map((k, idx) => (
              <Grid key={idx} size={{ xs: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
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
                          <Typography variant='caption' color='text.secondary' noWrap>
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

                      <IconButton
                        aria-label={`Select date for ${k.period}`}
                        onClick={() => handleDateClick(k.period)}
                        size='small'
                        sx={{ ml: 1, flexShrink: 0 }}
                      >
                        <i className='bx-calendar' />
                      </IconButton>
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

      <Dialog open={!!datePickerOpen} onClose={handleDateClose} maxWidth='xs' fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Select Date {datePickerOpen && `for ${datePickerOpen}`}</span>
        </DialogTitle>

        {period === 'lastweek' ? (
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              {/* From date-time input */}
              <TextField
                label='From'
                type='datetime-local'
                value={tempFromDate ? tempFromDate.toISOString().slice(0, 16) : ''}
                onChange={e => {
                  const d = e.target.value ? new Date(e.target.value) : null

                  setTempFromDate(d)
                  setSelectedDates(prev => ({
                    ...prev,
                    from: d ? formatToShortDate(d) : prev.from
                  }))
                }}
                fullWidth
                InputLabelProps={{ shrink: true }} // keeps label above field
                size='small'
              />

              <TextField
                sx={{ mt: 6 }}
                label='To'
                type='datetime-local'
                value={formatForDatetimeLocal(tempFromDate)}
                onChange={e => {
                  const d = e.target.value ? new Date(e.target.value) : null

                  setSelectedDates(prev => ({
                    ...prev,
                    to: d ? formatToShortDate(d) : prev.to
                  }))
                }}
                fullWidth
                InputLabelProps={{ shrink: true }}
                size='small'
              />
            </Box>
          </DialogContent>
        ) : (
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'stretch', pt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <TextField
                  label='Select date and time'
                  type='datetime-local'
                  value={formatForDatetimeLocal(tempFromDate)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value

                    if (value) {
                      const date = new Date(value)

                      setTempFromDate(date)
                      setSelectedDates(prev => ({
                        ...prev,
                        custom: formatToShortDate(date) // keep your display format for state
                      }))
                    }
                  }}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  size='small'
                />
              </Box>
            </Box>
          </DialogContent>
        )}

        <DialogActions>
          <Button onClick={handleDateClose}>Cancel</Button>
          <Button
            variant='contained'
            onClick={() => {
              handleDateSelect(datePickerOpen, tempDate)
            }}
            disabled={!datePickerOpen}
          >
            Select
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
