import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import type { Employee } from '@/types/apps/employeeTypes'

export const getAvatar = (params: Pick<Employee, 'avatar' | 'fname' | 'lname'>) => {
  const { avatar, fname, lname } = params

  if (avatar) {
    return <CustomAvatar src={avatar} skin='light' size={34} />
  } else {
    return (
      <CustomAvatar skin='light' size={34}>
        {getInitials(`${fname} ${lname}`)}
      </CustomAvatar>
    )
  }
}
