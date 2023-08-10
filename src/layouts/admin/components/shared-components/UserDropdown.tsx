import { Fragment, SyntheticEvent, useState } from 'react'

import { useAuth } from '@/hooks/useAuth'
import { Avatar, Badge, Menu, MenuItem } from '@mui/material'
import { styled } from '@mui/material/styles'
import { LogoutVariant } from 'mdi-material-ui'
import router from 'next/router'

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {
  const { user, signOut } = useAuth()

  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }
  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          onClick={handleDropdownOpen}
          alt={user?.firstName}
          sx={{ width: 40, height: 40 }}
          src={user?.image}
        />
      </Badge>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >

        <MenuItem sx={{ py: 2 }} onClick={signOut}>
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Sair
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
