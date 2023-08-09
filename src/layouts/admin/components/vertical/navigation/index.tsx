import { ReactNode, useRef, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { VerticalNavItemsType } from '@/configs/types'
import { Settings } from '@/context/settingsContext'
import { hexToRGBA } from '@/utils/hex-to-rgba'
import Box, { BoxProps } from '@mui/material/Box'
import List from '@mui/material/List'
import { styled, useTheme } from '@mui/material/styles'

import Drawer from './Drawer'
import VerticalNavHeader from './VerticalNavHeader'
import VerticalNavItems from './VerticalNavItems'

interface Props {
  hidden: boolean
  navWidth: number
  settings: Settings
  children: ReactNode
  navVisible: boolean
  toggleNavVisibility: () => void
  setNavVisible: (value: boolean) => void
  verticalNavItems?: VerticalNavItemsType
  saveSettings: (values: Settings) => void
  verticalNavMenuContent?: (props?: any) => ReactNode
  afterVerticalNavMenuContent?: (props?: any) => ReactNode
  beforeVerticalNavMenuContent?: (props?: any) => ReactNode
}

interface HTMLElementCustom extends HTMLElement {
  _getBoundingClientRect: () => DOMRect
}

const StyledBoxForShadow = styled(Box)<BoxProps>({
  top: 50,
  left: -8,
  zIndex: 2,
  height: 75,
  display: 'none',
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  '&.d-block': {
    display: 'block'
  }
})

const Navigation = (props: Props) => {
  const {
    hidden,
    afterVerticalNavMenuContent,
    beforeVerticalNavMenuContent,
    verticalNavMenuContent: userVerticalNavMenuContent
  } = props

  const [groupActive, setGroupActive] = useState<string[]>([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState<string[]>([])

  const shadowRef = useRef<HTMLElement | null>(null)

  const theme = useTheme()

  const handleInfiniteScroll = (ref: HTMLElementCustom) => {
    if (ref) {
      ref._getBoundingClientRect = ref.getBoundingClientRect

      ref.getBoundingClientRect = () => {
        const original = ref._getBoundingClientRect()

        return { ...original, height: Math.floor(original.height) }
      }
    }
  }

  const scrollMenu = (container: any) => {
    container = hidden ? container.target : container
    if (shadowRef && shadowRef.current && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains('d-block')) {
        shadowRef.current.classList.add('d-block')
      }
    } else if (shadowRef.current) {
      shadowRef.current.classList.remove('d-block')
    }
  }

  const ScrollWrapper = hidden ? Box : PerfectScrollbar as any

  return (
    <Drawer {...props}>
      <VerticalNavHeader {...props} />
      <StyledBoxForShadow
        ref={shadowRef}
        sx={{
          background: `linear-gradient(${theme.palette.background.default} 40%,${hexToRGBA(
            theme.palette.background.default,
            0.1
          )} 95%,${hexToRGBA(theme.palette.background.default, 0.05)})`
        }}
      />
      <Box sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
        <ScrollWrapper
          containerRef={(ref: any) => handleInfiniteScroll(ref)}
          {...(hidden
            ? {
              onScroll: (container: any) => scrollMenu(container),
              sx: { height: '100%', overflowY: 'auto', overflowX: 'hidden' }
            }
            : {
              options: { wheelPropagation: false },
              onScrollY: (container: any) => scrollMenu(container)
            })}
        >
          {beforeVerticalNavMenuContent ? beforeVerticalNavMenuContent(props) : null}
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {userVerticalNavMenuContent ? (
              userVerticalNavMenuContent(props)
            ) : (
              <List className='nav-items' sx={{ transition: 'padding .25s ease', pr: 4.5 }}>
                <VerticalNavItems
                  groupActive={groupActive}
                  setGroupActive={setGroupActive}
                  currentActiveGroup={currentActiveGroup}
                  setCurrentActiveGroup={setCurrentActiveGroup}
                  {...props}
                />
              </List>
            )}
          </Box>
        </ScrollWrapper>
      </Box>
      {afterVerticalNavMenuContent ? afterVerticalNavMenuContent(props) : null}
    </Drawer>
  )
}

export default Navigation
