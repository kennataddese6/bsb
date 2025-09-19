// Server Component: fetches sales data and renders the chart

import CRMBarChart from '@views/dashboards/crm/CRMBarChart'
import { getSalesData } from '@/app/server/actions'

const SalesChartServer = async ({
  searchParams
}: {
  searchParams: { freq?: 'yearly' | 'quarterly'; sales?: string }
}) => {
  const sales = await getSalesData(searchParams)

  return <CRMBarChart data={sales} />
}

export default SalesChartServer
