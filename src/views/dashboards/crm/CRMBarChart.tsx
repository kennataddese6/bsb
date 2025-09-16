'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const CRMBarChart = () => {
  // Hooks
  const theme = useTheme()

  // Vars
  const primaryColor = theme.palette.primary.main
  const divider = 'var(--mui-palette-divider)'
  const disabledText = 'var(--mui-palette-text-disabled)'

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: true },
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
      '#4f81bd'
    ],
    dataLabels: {
      enabled: true,
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
        columnWidth: '60%',
        distributed: false,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top',
          hideOverflowingLabels: true
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors: [primaryColor, '#00cfe8', '#4facfe'],
            inverseColors: false,
            opacityFrom: 0.8,
            opacityTo: 0.9,
            stops: [0, 100]
          }
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
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

  const series = [
    {
      name: '2016',
      data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
    },
    {
      name: '2017',
      data: [35, 48, 55, 62, 74, 85, 95, 105, 118]
    },
    {
      name: '2018',
      data: [40, 52, 58, 65, 78, 88, 98, 110, 128]
    },
    {
      name: '2019',
      data: [45, 58, 65, 72, 82, 92, 102, 115, 135]
    },
    {
      name: '2020',
      data: [50, 62, 70, 78, 88, 98, 108, 120, 140]
    },
    {
      name: '2021',
      data: [55, 68, 75, 82, 92, 102, 112, 125, 145]
    },
    {
      name: '2022',
      data: [60, 72, 80, 88, 98, 108, 118, 130, 150]
    },
    {
      name: '2023',
      data: [65, 78, 85, 92, 102, 112, 122, 135, 155]
    },
    {
      name: '2024',
      data: [70, 82, 90, 98, 108, 118, 128, 140, 160]
    },
    {
      name: '2025',
      data: [75, 88, 95, 102, 112, 122, 132, 145, 165]
    }
  ]

  // Calculate width based on number of data points (minimum 100% width, 30px per data point)
  const chartWidth = Math.max(100, series.length * 30) + '%'

  return (
    <Card className='bs-full'>
      <CardHeader
        title='Annual Sales Performance'
        subheader='Yearly comparison (2016-2025)'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
      />
      <CardContent sx={{ overflowX: 'auto', p: 0 }}>
        <div style={{ minWidth: '100%', width: chartWidth, padding: '0 24px 24px' }}>
          <AppReactApexCharts
            type='bar'
            width='100%'
            height={450}
            options={{
              ...options,
              chart: {
                ...options.chart,
                toolbar: {
                  ...options.chart?.toolbar,
                  tools: {
                    ...options.chart?.toolbar?.tools,
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                  }
                }
              },
              plotOptions: {
                ...options.plotOptions,
                bar: {
                  ...options.plotOptions?.bar,
                  columnWidth: '60%',
                  barHeight: '90%',
                  distributed: false,
                  borderRadius: 6,
                  borderRadiusApplication: 'end',
                  dataLabels: {
                    ...options.plotOptions?.bar?.dataLabels,
                    hideOverflowingLabels: true
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
        </div>
      </CardContent>
    </Card>
  )
}

export default CRMBarChart
