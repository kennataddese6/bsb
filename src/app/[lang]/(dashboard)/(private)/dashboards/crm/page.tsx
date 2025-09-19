// Components Imports
import { Suspense, use } from 'react'

import Card from '@mui/material/Card'

import ChartSkeleton from '@/views/dashboards/crm/components/ChartSkeleton'
import SalesChartServer from './SalesChartServer'
import SalesChartHeaderServer from './SalesChartHeaderServer'

// import EarningReports from '@views/dashboards/crm/EarningReports'
// import SalesAnalytics from '@views/dashboards/crm/SalesAnalytics'
// import SalesStats from '@views/dashboards/crm/SalesStats'

const DashboardCRM = ({ searchParams }: { searchParams: Promise<{ freq?: 'yearly' | 'quarterly' }> }) => {
  const sp = use(searchParams) as { freq?: 'yearly' | 'quarterly'; sales?: string }

  const suspenseKey = `freq=${sp?.freq ?? ''}&sales=${sp?.sales ?? ''}`
  const resolvedSearchParams = use(searchParams)

  return (
    <Card className='bs-full' sx={{ width: '100%' }}>
      <Suspense key={suspenseKey} fallback={<h1>Loading...</h1>}>
        <SalesChartHeaderServer searchParams={resolvedSearchParams} />
      </Suspense>
      <Suspense key={suspenseKey} fallback={<ChartSkeleton />}>
        <SalesChartServer searchParams={resolvedSearchParams} />
      </Suspense>
    </Card>
  )
}

export default DashboardCRM
