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

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const CRMBarChart = ({ data }: { data: ChartData }) => {
  // Hooks
  const theme = useTheme()
  const searchParams = useSearchParams()

  // State
  const { createSalesFrequencyUrl } = useChangeUrl()

  const [view, setView] = useState<'yearly' | 'quarterly'>(
    (searchParams.get('freq') as 'yearly' | 'quarterly') || 'yearly'
  )

  // ** Vars
  const divider = 'var(--mui-palette-divider)'
  const disabledText = 'var(--mui-palette-text-disabled)'

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

          return ['Q1', 'Q2', 'Q3', 'Q4']
        }

        if (isYearly) {
          return (data as YearlyChartData).months
        }

        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
        formatter: (val: number) => `${val}%`
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`
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

      return quarterlyData.salesData.map((yearData, yearIndex) => ({
        name: yearData.year,
        data: yearData.data.map(item => ({
          x: item.quarter,
          y: item.value,
          fillColor: colors[yearIndex % colors.length]
        }))
      }))
    }

    if (isYearly) {
      const yearlyData = data as YearlyChartData

      return yearlyData.salesData.map((yearData, yearIndex) => ({
        name: yearData.year,
        data: yearlyData.salesData[0].data.map((_, i) => {
          const item = yearData.data[i]

          return {
            x: `Month ${i + 1}`,
            y: item.value,
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

  // Extract years from chart data
  const years = data.years || []

  return (
    <Card className='bs-full' sx={{ width: '100%' }}>
      <CardHeader
        title='Sales Performance'
        subheader={`${view === 'yearly' ? 'Annual' : 'Quarterly'} comparison (${years[0] || ''}${years.length > 1 ? `-${years[years.length - 1]}` : ''})`}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                  py: 1,
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
                formatter: (val: number) => `${val}% growth`,
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
