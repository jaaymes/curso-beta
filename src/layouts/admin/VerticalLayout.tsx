import { useState } from 'react'

import ScrollToTop from '@/components/scroll-to-top'
import themeConfig from '@/configs/themeConfig'
import Box, { BoxProps } from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import { styled } from '@mui/material/styles'
import ArrowUp from 'mdi-material-ui/ArrowUp'

import AppBar from './components/vertical/appBar'
import Navigation from './components/vertical/navigation'
import { LayoutProps } from './types'


const VerticalLayoutWrapper = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  backgroundColor: theme.palette.background.paper
}))

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const VerticalLayout = (props: LayoutProps) => {
  const { settings, children, scrollToTop } = props

  const { contentWidth } = settings
  const navWidth = themeConfig.navigationSize

  const [navVisible, setNavVisible] = useState<boolean>(false)

  const toggleNavVisibility = () => setNavVisible(!navVisible)

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        <Navigation
          navWidth={navWidth}
          navVisible={navVisible}
          setNavVisible={setNavVisible}
          toggleNavVisibility={toggleNavVisibility}
          {...props}
        />
        <MainContentWrapper className='layout-content-wrapper'>
          <AppBar toggleNavVisibility={toggleNavVisibility} {...props} />

          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(contentWidth === 'boxed' && {
                mx: 'auto',
                '@media (min-width:1200px)': { maxWidth: '100%' }
              })
            }}
          >
            {children}
          </ContentWrapper>
        </MainContentWrapper>
      </VerticalLayoutWrapper>

      {/* Scroll to top button */}
      {scrollToTop ? (
        scrollToTop(props)
      ) : (
        <ScrollToTop className='mui-fixed'>
          <Fab color='primary' size='small' aria-label='scroll back to top'>
            <ArrowUp />
          </Fab>
        </ScrollToTop>
      )}
    </>
  )
}

export default VerticalLayout
