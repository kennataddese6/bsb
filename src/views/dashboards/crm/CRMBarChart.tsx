'use client'

// ** React Imports
import { useState, useMemo } from 'react'

// ** Next Imports
import dynamic from 'next/dynamic'

// ** MUI Imports
import { useSearchParams } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'

// ** Types
type ChartData = YearlyChartData | QuarterlyChartData

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

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

import useChangeUrl from '@/hooks/useChangeUrl'
import { MONTHS, QUARTERS } from '@/utils/dateConstants'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const CRMBarChart = ({
  data,
  salesPersons = []
}: {
  data: ChartData
  salesPersons?: Array<{ id: string; name: string }>
}) => {
  // Hooks
  const theme = useTheme()
  const searchParams = useSearchParams()

  // State
  const { createSalesFrequencyUrl, createSalesPersonUrl } = useChangeUrl()

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

  // ** Vars
  const divider = 'var(--mui-palette-divider)'
  const disabledText = 'var(--mui-palette-text-disabled)'
  const selectedSales = (searchParams.get('sales') as string) || 'all'
  const [salesFilter, setSalesFilter] = useState('')

  const filteredOptions = useMemo(() => {
    const lower = salesFilter.trim().toLowerCase()
    const allItem = salesOptions.find(o => o.id === 'all')

    const rest = salesOptions.filter(o => o.id !== 'all' && (!lower || o.name.toLowerCase().includes(lower)))

    return allItem ? [allItem, ...rest] : rest
  }, [salesOptions, salesFilter])

  // Determine if the data is yearly or quarterly
  const isYearly = 'months' in data && Array.isArray(data.months)
  const isQuarterly = 'quarters' in data && Array.isArray(data.quarters)

  // ** Chart Options
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      zoom: { enabled: true },
      foreColor: disabledText
    },
    colors: [
      '#4f81bd',
      '#c0504d',
      '#9bbb59',
      '#8064a2',
      '#4bacc6',
      '#f79646',
      '#8c8c8c',
      '#4aacc5',
      '#d16b16',
      '#9c27b0',
      '#5b9bd5',
      '#ed7d31',
      '#70ad47',
      '#7030a0',
      '#00b0f0',
      '#ffc000',
      '#7f7f7f',
      '#5b9bd5',
      '#ff0000',
      '#00b050'
    ],
    dataLabels: {
      enabled: false, // Disable data labels by default
      formatter: (val: number) => `${val}%`,
      style: {
        colors: ['#fff'],
        fontSize: '12px',
        fontWeight: 'bold'
      },
      offsetY: -20
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '100%',
        distributed: true,
        barHeight: '90%',
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top',
          hideOverflowingLabels: true
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: disabledText
      },
      markers: {
        offsetX: -3
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    grid: {
      borderColor: divider,
      strokeDashArray: 5,
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: {
          show: true,
          offsetX: -5
        }
      },
      padding: {
        top: -10
      }
    },
    xaxis: {
      type: 'category',
      categories: (() => {
        if (view === 'quarterly') {
          if (isQuarterly) {
            return (data as QuarterlyChartData).quarters
          }

          return [...QUARTERS]
        }

        if (isYearly) {
          return (data as YearlyChartData).months
        }

        return [...MONTHS]
      })(),
      axisBorder: { show: false },
      axisTicks: { color: divider },
      labels: {
        style: {
          colors: disabledText,
          fontSize: '13px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: disabledText,
          fontSize: '13px'
        },
        formatter: (val: number) => `${val}$`
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}$`
      }
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '60%'
            }
          }
        }
      }
    ]
  }

  // Transform data for the chart
  const series = useMemo(() => {
    if (!data) return []

    const colors = [
      '#4f81bd',
      '#c0504d',
      '#9bbb59',
      '#8064a2',
      '#4bacc6',
      '#f79646',
      '#8c8c8c',
      '#4aacc5',
      '#d16b16',
      '#9c27b0'
    ]

    if (view === 'quarterly' && isQuarterly) {
      const quarterlyData = data as QuarterlyChartData

      const sorted = [...quarterlyData.salesData].sort((a, b) => parseInt(a.year, 10) - parseInt(b.year, 10))

      return sorted.map((yearData, yearIndex) => ({
        name: yearData.year,
        data: yearData.data.map(item => ({
          x: item.quarter,
          y: typeof item.value === 'number' ? item.value : Number(item.value) || 0,
          fillColor: colors[yearIndex % colors.length]
        }))
      }))
    }

    if (isYearly) {
      const yearlyData = data as YearlyChartData

      const monthLabels =
        Array.isArray(yearlyData.months) && yearlyData.months.length === 12 ? yearlyData.months : [...MONTHS]

      const sorted = [...yearlyData.salesData].sort((a, b) => parseInt(a.year, 10) - parseInt(b.year, 10))

      return sorted.map((yearData, yearIndex) => ({
        name: yearData.year,
        data: monthLabels.map(m => {
          const found = (yearData.data || []).find(md => (md?.month || '').toString().toLowerCase() === m.toLowerCase())
          const yVal = typeof found?.value === 'number' ? found.value : Number(found?.value as any) || 0

          return {
            x: m,
            y: yVal,
            fillColor: colors[yearIndex % colors.length]
          }
        })
      }))
    }

    return []
  }, [data, view, isYearly, isQuarterly])

  if (!data) {
    return <div>No data available</div>
  }

  // Extract years from chart data and sort ascending for display
  const years = data.years || []
  const yearsSorted = [...years].sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

  return (
    <Card className='bs-full' sx={{ width: '100%' }}>
      <CardHeader
        title='Sales Performance'
        subheader={`${view === 'yearly' ? 'Annual' : 'Quarterly'} comparison (${yearsSorted[0] || ''}${yearsSorted.length > 1 ? `-${yearsSorted[yearsSorted.length - 1]}` : ''})`}
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
      <CardContent sx={{ p: 3 }}>
        <AppReactApexCharts
          key={`${view}-${selectedSales}`}
          type='bar'
          width='100%'
          height={450}
          options={{
            ...options,
            chart: {
              ...options.chart,
              type: 'bar',
              stacked: false
            },
            plotOptions: {
              ...options.plotOptions,
              bar: {
                ...options.plotOptions?.bar,
                columnWidth: '60%',
                barHeight: '90%',
                distributed: true,
                borderRadius: 6,
                borderRadiusApplication: 'end',
                dataLabels: {
                  ...options.plotOptions?.bar?.dataLabels,
                  hideOverflowingLabels: false
                }
              }
            },
            stroke: {
              show: true,
              width: 1,
              colors: ['transparent']
            },
            tooltip: {
              y: {
                formatter: (val: number) => `${val}$`,
                title: {
                  formatter: (seriesName: string) => `${seriesName}:`
                }
              },
              marker: {
                show: true
              },
              theme: theme.palette.mode
            },
            dataLabels: {
              ...options.dataLabels,
              enabled: false, // Ensure data labels are disabled in the chart options
              offsetY: -20,
              style: {
                ...options.dataLabels?.style,
                fontSize: '11px',
                colors: ['#fff']
              }
            }
          }}
          series={series}
        />
      </CardContent>
    </Card>
  )
}

export default CRMBarChart
