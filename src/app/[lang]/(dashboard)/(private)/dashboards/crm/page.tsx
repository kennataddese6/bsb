// ** MUI Imports
import { Suspense, use } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'

// ** Components Imports
import ChartSkeleton from '@/views/dashboards/crm/components/ChartSkeleton'
import SalesChartServer from './SalesChartServer'
import SalesChartHeaderServer from './SalesChartHeaderServer'

const DashboardCRM = ({ searchParams }: { searchParams: Promise<{ freq?: 'yearly' | 'quarterly' }> }) => {
  const sp = use(searchParams) as { freq?: 'yearly' | 'quarterly'; sales?: string }

  const suspenseKey = `freq=${sp?.freq ?? ''}&sales=${sp?.sales ?? ''}`
  const resolvedSearchParams = use(searchParams)

  return (
    <Card className='bs-full' sx={{ width: '100%' }}>
      <Suspense key={suspenseKey}>
        <SalesChartHeaderServer />
      </Suspense>
      <Suspense key={suspenseKey} fallback={<ChartSkeleton />}>
        <SalesChartServer searchParams={resolvedSearchParams} />
      </Suspense>
    </Card>
  )
}

export default DashboardCRM
