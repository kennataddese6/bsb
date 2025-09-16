'use client'

// ** React Imports
import { useState, useEffect, useMemo } from 'react'

// ** Next Imports
import dynamic from 'next/dynamic'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Types
interface SalesData {
  year: string
  data: Array<{
    month: string
    value: number
  }>
}

interface ChartData {
  years: string[]
  months: string[]
  salesData: SalesData[]
}

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const CRMBarChart = () => {
  // Hooks
  const theme = useTheme()

  // State
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'yearly' | 'quarterly'>('yearly')

  // ** Vars
  const divider = 'var(--mui-palette-divider)'
  const disabledText = 'var(--mui-palette-text-disabled)'

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
      categories:
        view === 'quarterly'
          ? ['Q1', 'Q2', 'Q3', 'Q4']
          : chartData?.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
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

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 5000))
        const response = await import('@/data/salesData.json')

        setChartData(response.default)
      } catch (err: unknown) {
        console.error('Error loading sales data:', err)
        setError('Failed to load sales data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, []) // Empty dependency array means this effect runs once on mount

  // Transform data for the chart
  const series = useMemo(() => {
    if (!chartData) return []

    return chartData.salesData.map((yearData, yearIndex) => {
      let displayData = [...yearData.data]

      if (view === 'quarterly') {
        // Group data by quarters
        const quarters = [
          { name: 'Q1', months: ['Jan', 'Feb', 'Mar'] },
          { name: 'Q2', months: ['Apr', 'May', 'Jun'] },
          { name: 'Q3', months: ['Jul', 'Aug', 'Sep'] },
          { name: 'Q4', months: ['Oct', 'Nov', 'Dec'] }
        ]

        displayData = quarters.map(quarter => {
          const quarterMonths = displayData.filter(item => quarter.months.includes(item.month))

          const avgValue = quarterMonths.reduce((sum, item) => sum + item.value, 0) / quarterMonths.length

          return {
            month: quarter.name,
            value: Math.round(avgValue * 10) / 10 // Round to 1 decimal place
          }
        })
      }

      return {
        name: yearData.year,
        data: displayData.map(item => ({
          x: item.month,
          y: item.value,
          fillColor: [
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
          ][yearIndex % 10]
        }))
      }
    })
  }, [chartData, view])

  if (isLoading) {
    return (
      <Card className='bs-full' sx={{ width: '100%' }}>
        <CardHeader
          title={<Skeleton variant='text' width={200} height={32} />}
          subheader={<Skeleton variant='text' width={150} height={24} />}
          sx={{
            flexDirection: ['column', 'row'],
            alignItems: ['flex-start', 'center'],
            '& .MuiCardHeader-action': { display: 'none' },
            flexWrap: 'wrap',
            '& .MuiCardHeader-content': { mb: [2, 0] }
          }}
        />
        <CardContent sx={{ p: 3, height: 450, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Skeleton variant='rectangular' height='100%' />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  // Extract years from chart data
  const years = chartData?.years || []

  return (
    <Card className='bs-full' sx={{ width: '100%' }}>
      <CardHeader
        title='Sales Performance'
        subheader={`${view === 'yearly' ? 'Annual' : 'Quarterly'} comparison (${years[0] || ''}${years.length > 1 ? `-${years[years.length - 1]}` : ''})`}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ToggleButtonGroup
              color='primary'
              value={view}
              exclusive
              onChange={(_, newView) => newView && setView(newView)}
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
