// Components Imports
import { Suspense, use } from 'react'

import ChartSkeleton from '@/views/dashboards/crm/components/ChartSkeleton'
import SalesChartServer from './SalesChartServer'

// import EarningReports from '@views/dashboards/crm/EarningReports'
// import SalesAnalytics from '@views/dashboards/crm/SalesAnalytics'
// import SalesStats from '@views/dashboards/crm/SalesStats'

const DashboardCRM = ({ searchParams }: { searchParams: Promise<{ freq?: 'yearly' | 'quarterly' }> }) => {
  const sp = use(searchParams)
  const suspenseKey = `freq=${sp?.freq ?? ''}`

  return (
    <Suspense key={suspenseKey} fallback={<ChartSkeleton />}>
      <SalesChartServer searchParams={searchParams} />
    </Suspense>
  )
}

export default DashboardCRM
