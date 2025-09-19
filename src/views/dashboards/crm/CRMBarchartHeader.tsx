'use client'

// ** React Imports
import { useState, useMemo } from 'react'

// ** MUI Imports
import { useSearchParams } from 'next/navigation'

import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'

import useChangeUrl from '@/hooks/useChangeUrl'

// ** Types
// type ChartData = YearlyChartData | QuarterlyChartData

interface BaseChartData {
  years: string[]
  salesData: Array<{
    year: string
    data: Array<{
      value: number
      [key: string]: any
    }>
  }>
  months?: string[]
  quarters?: string[]
}

interface YearlyChartData extends BaseChartData {
  months: string[]
  salesData: Array<{
    year: string
    data: Array<{
      month: string
      value: number
    }>
  }>
}

interface QuarterlyChartData extends BaseChartData {
  quarters: string[]
  salesData: Array<{
    year: string
    data: Array<{
      quarter: string
      value: number
    }>
  }>
}

const CRMBarChartHeader = ({
  // data,
  salesPersons
}: {
  // data: ChartData

  salesPersons?: Array<{ id: string; name: string }>
}) => {
  console.log(salesPersons, 'sales persons in header')
  const theme = useTheme()
  const searchParams = useSearchParams()
  const { createSalesFrequencyUrl, createSalesPersonUrl } = useChangeUrl()
  const selectedSales = (searchParams.get('sales') as string) || 'all'
  const [salesFilter, setSalesFilter] = useState('')

  const [view, setView] = useState<'yearly' | 'quarterly'>(
    (searchParams.get('freq') as 'yearly' | 'quarterly') || 'yearly'
  )

  // ** Salesperson Options from server (prepend 'All Sales')
  const salesOptions: Array<{ id: string; name: string }> = useMemo(() => {
    const list = Array.isArray(salesPersons) ? salesPersons : []
    const map = new Map<string, { id: string; name: string }>()

    // Always include the "All Sales" option
    map.set('all', { id: 'all', name: 'All Sales' })

    for (const s of list) {
      if (s && typeof s.id === 'string' && !map.has(s.id)) {
        map.set(s.id, { id: s.id, name: s.name })
      }
    }

    return Array.from(map.values())
  }, [salesPersons])

  const filteredOptions = useMemo(() => {
    const lower = salesFilter.trim().toLowerCase()
    const allItem = salesOptions.find(o => o.id === 'all')

    const rest = salesOptions.filter(o => o.id !== 'all' && (!lower || o.name.toLowerCase().includes(lower)))

    return allItem ? [allItem, ...rest] : rest
  }, [salesOptions, salesFilter])

  // const years = data.years || []
  // const yearsSorted = [...years].sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

  return (
    <CardHeader
      title='Sales Performance'
      subheader={`Annual and quarterly sales data`}
      key={`${view}-${selectedSales}`}
      // subheader={`${view === 'yearly' ? 'Annual' : 'Quarterly'} comparison (${yearsSorted[0] || ''}${yearsSorted.length > 1 ? `-${yearsSorted[yearsSorted.length - 1]}` : ''})`}
      action={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size='small' sx={{ minWidth: 240 }}>
            <Select
              value={selectedSales}
              onChange={e => {
                const val = e.target.value as string

                createSalesFrequencyUrl(view)
                createSalesPersonUrl(val === 'all' ? null : val)
              }}
              displayEmpty
              inputProps={{ 'aria-label': 'Select salesperson' }}
              sx={{
                height: 36,
                '& .MuiSelect-select': { py: 0, display: 'flex', alignItems: 'center' },
                borderRadius: 1
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    mt: 1,
                    borderRadius: 1,
                    boxShadow: theme.shadows[3],
                    '& .MuiList-root': {
                      maxHeight: 320,
                      overflowY: 'auto',
                      scrollbarWidth: 'thin',
                      '&::-webkit-scrollbar': { width: 6 },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'var(--mui-palette-divider)',
                        borderRadius: 8
                      }
                    }
                  }
                }
              }}
            >
              <MenuItem
                disableRipple
                disableTouchRipple
                disableGutters
                sx={{
                  px: 2,
                  py: 1,
                  '&:hover': { backgroundColor: 'transparent' },
                  '&.Mui-focusVisible': { backgroundColor: 'transparent' },
                  '&.Mui-selected': { backgroundColor: 'transparent !important' }
                }}
              >
                <TextField
                  autoFocus
                  placeholder='Search salesperson'
                  size='small'
                  value={salesFilter}
                  onChange={e => {
                    e.stopPropagation()
                    setSalesFilter(e.target.value)
                  }}
                  onKeyDown={e => {
                    // Prevent Select's default type-to-select behavior while typing in the search field
                    e.stopPropagation()
                  }}
                  onClick={e => e.stopPropagation()}
                  sx={{ width: '100%' }}
                />
              </MenuItem>
              {filteredOptions.map(opt => (
                <MenuItem key={opt.id} value={opt.id}>
                  {opt.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup
            color='primary'
            value={searchParams.get('freq') || 'yearly'}
            exclusive
            onChange={(_, newView) => {
              newView && setView(newView)
              createSalesFrequencyUrl(newView)
            }}
            aria-label='chart view type'
            size='small'
            sx={{
              '& .MuiToggleButton-root': {
                px: 3,
                height: 36,
                lineHeight: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }
              }
            }}
          >
            <ToggleButton value='yearly'>Yearly</ToggleButton>
            <ToggleButton value='quarterly'>Quarterly</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      }
      sx={{
        flexDirection: ['column', 'row'],
        alignItems: ['flex-start', 'center'],
        '& .MuiCardHeader-action': { mt: [2, 0] },
        flexWrap: 'wrap',
        '& .MuiCardHeader-content': { mb: [2, 0] }
      }}
    />
  )
}

export default CRMBarChartHeader
