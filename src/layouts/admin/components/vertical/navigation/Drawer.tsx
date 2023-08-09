import { ReactNode } from 'react'

import { Settings } from '@/context/settingsContext'
import MuiSwipeableDrawer from '@mui/material/SwipeableDrawer'
import { useTheme } from '@mui/material/styles'

interface Props {
  hidden: boolean
  navWidth: number
  settings: Settings
  navVisible: boolean
  children: ReactNode
  setNavVisible: (value: boolean) => void
  saveSettings: (values: Settings) => void
}

const Drawer = (props: Props) => {
  const { hidden, children, navWidth, navVisible, setNavVisible } = props

  const theme = useTheme()

  const MobileDrawerProps = {
    open: navVisible,
    onOpen: () => setNavVisible(true),
    onClose: () => setNavVisible(false),
    ModalProps: {
      keepMounted: true // Better open performance on mobile.
    }
  }

  const DesktopDrawerProps = {
    open: true,
    onOpen: () => null,
    onClose: () => null
  }

  return (
    <MuiSwipeableDrawer
      className='layout-vertical-nav'
      variant={hidden ? 'temporary' : 'permanent'}
      {...(hidden ? { ...MobileDrawerProps } : { ...DesktopDrawerProps })}
      PaperProps={{ sx: { width: navWidth } }}
      sx={{
        width: navWidth,
        '& .MuiDrawer-paper': {
          borderRight: 0,
          backgroundColor: theme.palette.background.default
        }
      }}
    >
      {children}
    </MuiSwipeableDrawer>
  )
}

export default Drawer
