// Server Component: fetches sales data and renders the chart

import Grid from '@mui/material/Grid2'

import CRMBarChart from '@views/dashboards/crm/CRMBarChart'
import { getSalesData } from '@/app/server/actions'

const SalesChartServer = async ({
  searchParams
}: {
  searchParams: { freq?: 'yearly' | 'quarterly'; sales?: string }
}) => {
  const sales = await getSalesData(searchParams)

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CRMBarChart data={sales} />
      </Grid>
    </Grid>
  )
}

export default SalesChartServer
