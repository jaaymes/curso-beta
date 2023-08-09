import { Fragment } from 'react'

import { useAuth } from '@/hooks/useAuth'
import { Avatar, Badge } from '@mui/material'
import { styled } from '@mui/material/styles'

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {
  const { user } = useAuth()
  return (
    <Fragment>
      <Badge
        overlap='circular'
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt={user?.firstName}
          sx={{ width: 40, height: 40 }}
          src={user?.image}
        />
      </Badge>
    </Fragment>
  )
}

export default UserDropdown
