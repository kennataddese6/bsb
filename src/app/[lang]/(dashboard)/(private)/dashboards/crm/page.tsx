// MUI Imports

import Grid from '@mui/material/Grid2'

// Components Imports
import CRMBarChart from '@views/dashboards/crm/CRMBarChart'
import { getSalesData } from '@/app/server/actions'

// import EarningReports from '@views/dashboards/crm/EarningReports'
// import SalesAnalytics from '@views/dashboards/crm/SalesAnalytics'
// import SalesStats from '@views/dashboards/crm/SalesStats'

const DashboardCRM = async ({ searchParams }: { searchParams: Promise<{ freq?: 'yearly' | 'quarterly' }> }) => {
  // redirect('/en/employees')
  const resolvedSearchParams = await searchParams
  const data = await getSalesData(resolvedSearchParams)

  return (
    <Grid container spacing={6}>
      {/* Full-width Bar Chart */}
      <Grid size={{ xs: 12 }}>
        <CRMBarChart data={data} />
      </Grid>

      {/* Key Metrics Cards */}
      {/*       <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <EarningReports />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <SalesAnalytics />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <SalesStats />
      </Grid> */}
    </Grid>
  )
}

export default DashboardCRM
