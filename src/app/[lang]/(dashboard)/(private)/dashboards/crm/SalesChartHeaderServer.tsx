// Server Component: fetches sales data and renders the chart

import Grid from '@mui/material/Grid2'

import { /* getSalesData, */ getSalesPerson } from '@/app/server/actions'
import CRMBarChartHeader from '@/views/dashboards/crm/CRMBarchartHeader'

const SalesChartHeaderServer = async (/* {
  searchParams
}: {
  searchParams: { freq?: 'yearly' | 'quarterly'; sales?: string }
} */) => {
  // const resolvedSearchParams = await searchParams

  const salesPersons = await getSalesPerson({ page: '1', size: '10' })

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CRMBarChartHeader /* data={data} */ salesPersons={salesPersons.data} />
      </Grid>
    </Grid>
  )
}

export default SalesChartHeaderServer
