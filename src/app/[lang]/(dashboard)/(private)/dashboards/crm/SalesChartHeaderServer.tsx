// Server Component: fetches sales data and renders the chart

import Grid from '@mui/material/Grid2'

import { getSalesPerson } from '@/app/server/actions'
import CRMBarChartHeader from '@/views/dashboards/crm/CRMBarchartHeader'

const SalesChartHeaderServer = async () => {
  const salesPersons = await getSalesPerson({ page: '1', size: '10' })

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CRMBarChartHeader salesPersons={salesPersons.data} />
      </Grid>
    </Grid>
  )
}

export default SalesChartHeaderServer
