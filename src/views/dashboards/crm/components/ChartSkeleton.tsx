// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'

interface ChartSkeletonProps {
  titleWidth?: number
  subtitleWidth?: number
  height?: number | string
}

const ChartSkeleton = ({ titleWidth = 200, subtitleWidth = 150, height = 450 }: ChartSkeletonProps) => {
  return (
    <Card className='bs-full' sx={{ width: '100%' }}>
      <CardHeader
        title={<Skeleton variant='text' width={titleWidth} height={32} />}
        subheader={<Skeleton variant='text' width={subtitleWidth} height={24} />}
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { display: 'none' },
          flexWrap: 'wrap',
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
      />
      <CardContent sx={{ p: 3, height, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Skeleton variant='rectangular' height='100%' />
      </CardContent>
    </Card>
  )
}

export default ChartSkeleton
