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
    colors: [primaryColor, '#00cfe8', '#7367f0', '#ff9f43', '#ea5455'],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
        distributed: false,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top'
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
      xaxis: {
        lines: { show: false }
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
      data: [20, 35, 40, 30, 49, 60, 70, 91, 100]
    },
    {
      name: '2018',
      data: [10, 25, 30, 20, 39, 40, 50, 60, 75]
    },
    {
      name: '2019',
      data: [10, 25, 30, 20, 39, 40, 50, 60, 75]
    },
    {
      name: '2020',
      data: [10, 25, 30, 20, 39, 40, 50, 60, 75]
    },
    {
      name: '2021',
      data: [10, 25, 30, 20, 39, 40, 50, 60, 75]
    },
    {
      name: '2022',
      data: [10, 25, 30, 20, 39, 40, 50, 60, 75]
    },
    {
      name: '2023',
      data: [10, 25, 30, 20, 39, 40, 50, 60, 75]
    },
    {
      name: '2024',
      data: [10, 25, 30, 20, 39, 40, 50, 60, 75]
    },
    {
      name: '2025',
      data: [10, 25, 30, 20, 39, 40, 50, 60, 75]
    }
  ]

  return (
    <Card className='bs-full'>
      <CardHeader
        title='Sales Performance'
        subheader='Monthly sales comparison'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
      />
      <CardContent>
        <AppReactApexCharts type='bar' width='100%' height={400} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default CRMBarChart
