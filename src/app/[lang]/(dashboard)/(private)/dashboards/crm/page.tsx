'use client'

import * as React from 'react'

import Image from 'next/image'

import {
  Box,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Button,
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

import { useQuery } from '@tanstack/react-query'

import { useCurrentTime } from '@/hooks/useCurrentTime'
import { defaultDate } from '@/utils/defaultDate'
import type { Period, SelectedDates } from '@/types/apps/variants'

// import { getRelativeDayLabel } from '@/utils/relativeDayLabel'
import { formatToShortDate } from '@/utils/formatToShortDate'
import { formatForDatetimeLocal } from '@/utils/formatForDatetimeLocal'
import { parseFlexibleDate } from '@/utils/parseFlexibleDate'
import { getFamilies, getItems } from '@/hooks/fetches'
import { VariantsTable } from './components/VariantsTable'
import { TargetActual } from './components/TargetActual'
import { PpcAndDeal } from './components/PpcAndDeal'
import { KpiDateCard } from './components/KpiDateCard'
import type { Item } from '@/types/apps/salesChartTypes'
import { buildApiDate } from '@/utils/buildApiDate'
import { buildApiDateMidnight } from '@/utils/buildApiDateMidnight'

// Local types for stronger safety in this file
type FamilyOption = { asin: string; groupName: string }

/* ----------------------------- Page ------------------------------ */
export default function Page(): JSX.Element {
  const target = 7000
  const actual = 5015
  const maxScale = 9000 // for the background bar

  const [datePickerOpen, setDatePickerOpen] = React.useState<Period | null>(null)

  // temporary date shown inside the inline picker before confirmation
  const [tempDate, setTempDate] = React.useState<Date | null>(null)
  const [timezone, setTimezone] = React.useState('PST')
  const [period, setPeriod] = React.useState<Period>('today')
  const [allFamilySelected, selectAllFamily] = React.useState<boolean>(false)
  const [tempFromDate, setTempFromDate] = React.useState<Date | null>(null)
  const [tempToDate, setTempToDate] = React.useState<Date | null>(null)
  const [family, setFamily] = React.useState<string | null>(null)
  const [parentItem, setParentItem] = React.useState<Item | null>(null)

  const currentTime = useCurrentTime(timezone)
  const currentTimeWithoutSeconds = useCurrentTime(timezone, false)

  const [selectedDates, setSelectedDates] = React.useState<SelectedDates>({
    today: '',
    yesterday: '',
    lastweek: { from: '', to: '' },
    custom: ''
  })

  const setDefaultDates = () => {
    setSelectedDates(defaultDate(timezone))
  }

  /* Open dialog and seed the tempDate from selectedDates */
  const handleDateClick = (p: Period) => {
    setPeriod(p)
    setDatePickerOpen(p)

    if (p === 'lastweek') {
      setTempDate(null)
    } else {
      const value = selectedDates[p] as string

      setTempDate(parseFlexibleDate(value))
    }
  }

  const handleDateClose = () => {
    setDatePickerOpen(null)
    setTempDate(null)
    setTempFromDate(null)
    setTempToDate(null)
  }

  const handleDateSelect = (period: Period | null, date: Date | null) => {
    if (!period) return

    if (period === 'lastweek') {
      if (!tempFromDate || !tempToDate) return

      const from = formatToShortDate(tempFromDate)
      const to = formatToShortDate(tempToDate)

      setSelectedDates(prev => ({ ...prev, lastweek: { from, to } }))

      setDatePickerOpen(null)
      setTempDate(null)

      return
    }

    const formatted = date ? formatToShortDate(date) : selectedDates[period]

    setSelectedDates(prev => ({ ...prev, [period]: formatted }))
    setDatePickerOpen(null)
    setTempDate(null)
  }

  const defaultDates = defaultDate(timezone)

  const todayLabel = selectedDates.today ? selectedDates.today : `${defaultDates.today} ${currentTimeWithoutSeconds}`

  const yesterdayLabel = selectedDates.yesterday
    ? selectedDates.yesterday
    : `${defaultDates.yesterday} ${currentTimeWithoutSeconds}`

  const lastweekLabel = selectedDates.lastweek.from
    ? `${selectedDates.lastweek.from} - ${selectedDates.lastweek.to}`
    : `${defaultDates.lastweek.from} ${currentTimeWithoutSeconds}`

  const todayISO = buildApiDate(todayLabel)
  const yesterdayISO = buildApiDate(yesterdayLabel)

  const lastweekFromISO = buildApiDate(
    selectedDates.lastweek.from || `${defaultDates.lastweek.from} ${currentTimeWithoutSeconds}`
  )

  const lastweekToISO = buildApiDate(
    selectedDates.lastweek.to || `${defaultDates.lastweek.to} ${currentTimeWithoutSeconds}`
  )

  // For today and yesterday, startDate should be that date at 00:00:00
  const todayStartISO = buildApiDateMidnight(
    selectedDates.today || `${defaultDates.today} ${currentTimeWithoutSeconds}`
  )

  const yesterdayStartISO = buildApiDateMidnight(
    selectedDates.yesterday || `${defaultDates.yesterday} ${currentTimeWithoutSeconds}`
  )

  const { data, isLoading } = useQuery<FamilyOption[]>({
    queryKey: ['families'],
    queryFn: getFamilies,
    staleTime: 5000
  })

  const { data: itemsData, isLoading: itemsLoading } = useQuery<Item[]>({
    queryKey: ['families', family, timezone],
    queryFn: () => getItems(family as string, timezone === 'PST' ? 'America/Los_Angeles' : 'America/New_York'),
    enabled: Boolean(family),
    staleTime: 5000
  })

  React.useEffect(() => {
    if (!itemsData || itemsData.length === 0) return

    for (const item of itemsData) {
      if (item.Asin === item.ParentAsin) {
        setParentItem(item)
        break
      }
    }
  }, [itemsData])

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
            {parentItem && (
              <>
                <Box
                  sx={{
                    position: 'relative',
                    width: 112,
                    height: 112,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 1
                  }}
                >
                  <Image
                    src={parentItem.ImageUrl || '/images/apps/ecommerce/product-1.png'}
                    alt='Tree Bag'
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    ASIN
                  </Typography>
                  <Typography variant='h5' sx={{ fontWeight: 600, lineHeight: 1.2, mb: 0.5 }}>
                    {parentItem.Asin}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500 }}>
                    {parentItem.GroupName}
                  </Typography>
                </Box>
              </>
            )}
            <Autocomplete
              disablePortal
              options={!isLoading && Array.isArray(data) ? (data as FamilyOption[]) : []}
              getOptionLabel={(option: FamilyOption) => option.groupName}
              sx={{ width: 300 }}
              onChange={(event, value: FamilyOption | null) => {
                setFamily(value ? value.asin : null)
              }}
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
          <VariantsTable itemsData={itemsData} itemsLoading={itemsLoading} onSelect={item => setParentItem(item)} />
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          {/* KPI Tiles */}
          <Grid container spacing={4}>
            <Grid size={{ xs: 6, md: 3 }}>
              <KpiDateCard
                period={'today'}
                labelText={todayLabel}
                fromISO={todayStartISO}
                toISO={todayISO}
                timezone={timezone as 'PST' | 'EST'}
                family={family}
                parentItemAsin={parentItem?.Asin || null}
                isParent={allFamilySelected}
                onOpenDate={() => handleDateClick('today')}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <KpiDateCard
                period={'yesterday'}
                labelText={yesterdayLabel}
                fromISO={yesterdayStartISO}
                toISO={yesterdayISO}
                timezone={timezone as 'PST' | 'EST'}
                family={family}
                parentItemAsin={parentItem?.Asin || null}
                isParent={allFamilySelected}
                onOpenDate={() => handleDateClick('yesterday')}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <KpiDateCard
                period={'lastweek'}
                labelText={lastweekLabel}
                fromISO={lastweekFromISO}
                toISO={lastweekToISO}
                timezone={timezone as 'PST' | 'EST'}
                family={family}
                parentItemAsin={parentItem?.Asin || null}
                isParent={allFamilySelected}
                onOpenDate={() => handleDateClick('lastweek')}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Stack direction='row' justifyContent='space-between' alignItems='center'>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Button
                        variant='text'
                        onClick={() => handleDateClick('custom')}
                        sx={{
                          p: 0,
                          minHeight: 'auto',
                          textAlign: 'left',
                          justifyContent: 'flex-start',
                          '&:hover': { bgcolor: 'transparent' }
                        }}
                      >
                        <Typography variant='caption' color='text.secondary' noWrap>
                          Today mm-dd-yyyy 10:18
                        </Typography>
                      </Button>
                      <Typography variant='h5' sx={{ mt: 1, color: 'primary.main', fontWeight: 700 }}>
                        15/14
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Units / Orders
                      </Typography>
                    </Box>

                    <IconButton
                      aria-label={`Select date for ${'custom'}`}
                      onClick={() => handleDateClick('custom')}
                      size='small'
                      sx={{ ml: 1, flexShrink: 0 }}
                    >
                      <i className='bx-calendar' />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Prices */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              { label: 'Today’s Price', value: '$44.99', icon: <i className={'bx-dollar-circle'} /> },
              { label: 'Today’s Average Price', value: '$48.65', icon: <i className={'bx-trending-up'} /> },
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

          <TargetActual target={target} actual={actual} maxScale={maxScale} />

          <Grid container spacing={4} sx={{ mt: 4 }}>
            <PpcAndDeal ppcSpent={'$2,548'} dealTitle={'Deal Running'} />
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
                value={formatForDatetimeLocal(tempFromDate)}
                onChange={e => {
                  const d = e.target.value ? new Date(e.target.value) : null

                  setTempFromDate(d)
                }}
                fullWidth
                InputLabelProps={{ shrink: true }} // keeps label above field
                size='small'
              />

              <TextField
                sx={{ mt: 6 }}
                label='To'
                type='datetime-local'
                value={formatForDatetimeLocal(tempToDate)}
                onChange={e => {
                  const d = e.target.value ? new Date(e.target.value) : null

                  setTempToDate(d)
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
                  value={formatForDatetimeLocal(tempDate)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value

                    if (value) {
                      const date = new Date(value)

                      setTempDate(date)
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
