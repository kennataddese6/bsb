'use client'

// ** React Imports
import { useState } from 'react'

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

// ** Hook Imports
import useChangeUrl from '@/hooks/useChangeUrl'

const CRMBarChartHeader = ({ salesPersons }: { salesPersons?: Array<{ id: string; name: string }> }) => {
  const theme = useTheme()
  const searchParams = useSearchParams()
  const { createSalesFrequencyUrl, createSalesPersonUrl } = useChangeUrl()
  const selectedSales = (searchParams.get('sales') as string) || 'all'

  const [salesFilter, setSalesFilter] = useState('')
  const [selectedSalesPerson, setSelectedSalesPerson] = useState('all')

  const [view, setView] = useState<'yearly' | 'quarterly'>(
    (searchParams.get('freq') as 'yearly' | 'quarterly') || 'yearly'
  )

  return (
    <CardHeader
      title='Sales Performance'
      subheader={`Annual and quarterly sales data`}
      key={`${view}-${selectedSales}`}
      action={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size='small' sx={{ minWidth: 240 }}>
            <Select
              value={selectedSalesPerson}
              onChange={e => {
                const val = e.target.value as string

                setSelectedSalesPerson(val)
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
              <MenuItem key={'all'} value={'all'}>
                All Sales
              </MenuItem>
              {salesPersons?.map(opt => (
                <MenuItem key={opt.id} value={opt.id}>
                  {opt.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup
            color='primary'
            value={view || searchParams.get('freq') || 'yearly'}
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
