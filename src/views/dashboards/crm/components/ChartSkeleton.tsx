// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'

interface ChartSkeletonProps {
  titleWidth?: number
  subtitleWidth?: number
  height?: number | string
}

const ChartSkeleton = ({ height = 450 }: ChartSkeletonProps) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant='rectangular' height={height as number} width='100%' />
      </CardContent>
    </Card>
  )
}

export default ChartSkeleton
