import { ReactNode, useEffect, useState } from 'react'

import { Settings } from '@/context/settingsContext'
import MuiSwipeableDrawer, { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer'
import { styled, useTheme } from '@mui/material/styles'


interface Props {
  hidden: boolean
  navWidth: number
  settings: Settings
  navVisible: boolean
  children: ReactNode
  setNavVisible: (value: boolean) => void
  saveSettings: (values: Settings) => void
}

const SwipeableDrawer = styled(MuiSwipeableDrawer)<SwipeableDrawerProps>({
  overflowX: 'hidden',
  transition: 'width .25s ease-in-out',
  '& ul': {
    listStyle: 'none'
  },
  '& .MuiListItem-gutters': {
    paddingLeft: 4,
    paddingRight: 4,
  },
  '& .MuiDrawer-paper': {
    left: 'unset',
    right: 'unset',
    overflowX: 'hidden',
    transition: 'width .25s ease-in-out, box-shadow .25s ease-in-out',
  }
})

const Drawer = (props: Props) => {
  const { hidden, children, navWidth, navVisible, setNavVisible } = props
  const [isSSR, setIsSSR] = useState(true)

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSSR(false)
    }
  }, [isSSR])

  return (
    <>
      {
        !isSSR && (
          <SwipeableDrawer
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
          </SwipeableDrawer>
        )
      }
    </>
  )
}

export default Drawer
