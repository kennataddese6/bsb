'use client'

// ** React Imports
import { useMemo } from 'react'

// ** Next Imports
import dynamic from 'next/dynamic'

// ** MUI Imports
import { useSearchParams } from 'next/navigation'

import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

import type { ApexOptions } from 'apexcharts'

// ** Types
import type { ChartData, QuarterlyChartData, YearlyChartData } from '@/types/apps/salesChartTypes'

// Third-party Imports

import { MONTHS, QUARTERS } from '@/utils/dateConstants'
import { formatUSD } from '@/utils/formatters/formatUSD'
import { colors } from '@/data/colors'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const CRMBarChart = ({ data }: { data: ChartData }) => {
  // Hooks
  const theme = useTheme()
  const searchParams = useSearchParams()

  // State
  const frequency = (searchParams.get('freq') as string) || 'yearly'

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
    colors: colors,
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
        if (frequency === 'quarterly') {
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

    if (frequency === 'quarterly' && isQuarterly) {
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
  }, [data, frequency, isYearly, isQuarterly])

  if (!data) {
    return <div>No data available</div>
  }

  return (
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

                // hovered index not used since tooltip rows are uniform

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

                  // Do not apply special styling to the first (or any) item — keep all rows uniform
                  const rowStyle = ''
                  const nameStyle = 'font-weight:600'
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
  )
}

export default CRMBarChart
