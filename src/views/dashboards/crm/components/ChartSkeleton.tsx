// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

interface ChartSkeletonProps {
  titleWidth?: number
  subtitleWidth?: number
  height?: number | string
}

const ChartSkeleton = ({ height = 450 }: ChartSkeletonProps) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height
          }}
        >
          <CircularProgress />
        </Box>
      </CardContent>
    </Card>
  )
}

export default ChartSkeleton
