// Server Component: fetches sales data and renders the chart

import Grid from '@mui/material/Grid2'

import CRMBarChart from '@views/dashboards/crm/CRMBarChart'
import { getSalesData } from '@/app/server/actions'

const SalesChartServer = async ({
  searchParams
}: {
  searchParams: Promise<{ freq?: 'yearly' | 'quarterly'; sales?: string }>
}) => {
  const resolvedSearchParams = await searchParams
  const data = await getSalesData(resolvedSearchParams)

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CRMBarChart data={data} />
      </Grid>
    </Grid>
  )
}

export default SalesChartServer
