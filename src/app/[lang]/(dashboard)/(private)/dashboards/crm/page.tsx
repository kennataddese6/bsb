// Components Imports
import { Suspense, use } from 'react'

import ChartSkeleton from '@/views/dashboards/crm/components/ChartSkeleton'
import SalesChartServer from './SalesChartServer'

// import EarningReports from '@views/dashboards/crm/EarningReports'
// import SalesAnalytics from '@views/dashboards/crm/SalesAnalytics'
// import SalesStats from '@views/dashboards/crm/SalesStats'

const DashboardCRM = ({ searchParams }: { searchParams: Promise<{ freq?: 'yearly' | 'quarterly' }> }) => {
  const sp = use(searchParams) as { freq?: 'yearly' | 'quarterly'; sales?: string }
  const suspenseKey = `freq=${sp?.freq ?? ''}&sales=${sp?.sales ?? ''}`

  return (
    <Suspense key={suspenseKey} fallback={<ChartSkeleton />}>
      <SalesChartServer searchParams={searchParams} />
    </Suspense>
  )
}

export default DashboardCRM
