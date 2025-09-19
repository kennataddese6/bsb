// Server Component: fetches sales data and renders the chart

import { getSalesPerson } from '@/app/server/actions'
import CRMBarChartHeader from '@/views/dashboards/crm/CRMBarchartHeader'

const SalesChartHeaderServer = async () => {
  const salesPersons = await getSalesPerson({ page: '1', size: '10' })

  return <CRMBarChartHeader salesPersons={salesPersons.data} />
}

export default SalesChartHeaderServer
