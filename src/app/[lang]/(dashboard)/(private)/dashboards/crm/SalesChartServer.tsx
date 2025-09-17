// Server Component: fetches sales data and renders the chart

import Grid from '@mui/material/Grid2'

import CRMBarChart from '@views/dashboards/crm/CRMBarChart'
import { getSalesData, getSalesPerson } from '@/app/server/actions'

const SalesChartServer = async ({
  searchParams
}: {
  searchParams: Promise<{ freq?: 'yearly' | 'quarterly'; sales?: string }>
}) => {
  const resolvedSearchParams = await searchParams

  const [data, sales] = await Promise.all([
    getSalesData(resolvedSearchParams),
    getSalesPerson({ page: '1', size: '100' })
  ])

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CRMBarChart data={data} salesPersons={sales?.data || []} />
      </Grid>
    </Grid>
  )
}

export default SalesChartServer
