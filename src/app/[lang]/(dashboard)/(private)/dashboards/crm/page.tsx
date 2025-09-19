// ** MUI Imports
import { Suspense, use } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'

import Grid from '@mui/material/Grid2'

// ** Components Imports
import ChartSkeleton from '@/views/dashboards/crm/components/ChartSkeleton'
import SalesChartServer from './SalesChartServer'
import SalesChartHeaderServer from './SalesChartHeaderServer'

const DashboardCRM = ({ searchParams }: { searchParams: Promise<{ freq?: 'yearly' | 'quarterly' }> }) => {
  const sp = use(searchParams) as { freq?: 'yearly' | 'quarterly'; sales?: string }
  const suspenseKey = `freq=${sp?.freq ?? ''}&sales=${sp?.sales ?? ''}`
  const resolvedSearchParams = use(searchParams)

  return (
    <Card sx={{ width: '100%' }}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <SalesChartHeaderServer />
          <Suspense key={suspenseKey} fallback={<ChartSkeleton />}>
            <SalesChartServer searchParams={resolvedSearchParams} />
          </Suspense>
        </Grid>
      </Grid>
    </Card>
  )
}

export default DashboardCRM
