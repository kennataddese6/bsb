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
import { formatUSD } from '@/utils/formatters/formatUSD'

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
        formatter: (val: number) => formatUSD(val)
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatUSD(val)
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
              shared: true,
              intersect: false,
              y: {
                formatter: (val: number) => formatUSD(val)
              },
              marker: {
                show: true
              },
              theme: theme.palette.mode,
              custom: (opts: any) => {
                try {
                  const w = opts.w || {}
                  const idx = typeof opts.dataPointIndex === 'number' ? opts.dataPointIndex : 0

                  const seriesConfig = Array.isArray(w.config?.series) ? w.config.series : []
                  const values = Array.isArray(opts.series) ? opts.series : (w.globals && w.globals.series) || []
                  const hovered = typeof opts.seriesIndex === 'number' ? opts.seriesIndex : undefined

                  const category =
                    (w.globals && w.globals.categoryLabels && w.globals.categoryLabels[idx]) ||
                    (w.config?.xaxis?.categories?.[idx] ?? '')

                  const colors = Array.isArray(w.config?.colors) ? w.config.colors : options.colors || []

                  let html = `\n                    <div style="padding:8px 12px; font-size:13px; background:#1f2937; color:#fff; border-radius:6px;">\n                      <div style=\"font-weight:700; margin-bottom:8px\">${category}</div>\n                  `

                  for (let i = 0; i < seriesConfig.length; i++) {
                    const s = seriesConfig[i]
                    let val: any = 0

                    if (Array.isArray(values) && Array.isArray(values[i])) {
                      const raw = values[i][idx]

                      val = typeof raw === 'number' ? raw : ((raw && (raw.y ?? raw.value)) ?? 0)
                    } else if (s && Array.isArray(s.data)) {
                      const d = s.data[idx]

                      val = typeof d === 'number' ? d : (d && (d.y ?? d.value)) || 0
                    }

                    val = Number(val) || 0

                    const isHovered = typeof hovered === 'number' && hovered === i
                    const rowStyle = isHovered ? 'background:rgba(255,255,255,0.03);padding:6px;border-radius:4px' : ''
                    const nameStyle = isHovered ? 'font-weight:700' : 'font-weight:600'
                    const bulletColor = colors[i] || '#ccc'

                    html += `\n                      <div style=\"display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:6px;${rowStyle}\">\n                        <div style=\"display:flex;align-items:center;gap:8px\">\n                          <span style=\"width:10px;height:10px;border-radius:50%;background:${bulletColor};display:inline-block\"></span>\n                          <div style=\"color:#fff; ${nameStyle}\">${s?.name}</div>\n                        </div>\n                        <div style=\"color:#fff;font-weight:700\">${formatUSD(val)}</div>\n                      </div>\n                    `
                  }

                  html += '\n                    </div>\n                  '

                  return html
                } catch (e) {
                  return ''
                }
              }
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
