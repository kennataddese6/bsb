import { getSalesPerson } from '@/app/server/actions'
import CRMBarChartHeader from '@/views/dashboards/crm/CRMBarchartHeader'

const SalesChartHeaderServer = async () => {
  const salesPersons = await getSalesPerson()

  return <CRMBarChartHeader salesPersons={salesPersons.data} />
}

export default SalesChartHeaderServer
