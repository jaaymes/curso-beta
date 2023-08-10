import { ReactNode } from 'react'

import themeConfig from '@/configs/themeConfig'
import { Settings } from '@/context/settingsContext'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'

import { UtilsProvider } from '@/context/utilsContext'
import { Toaster } from 'react-hot-toast'
import themeOptions from './ThemeOptions'
import GlobalStyling from './globalStyles'
import overrides from './overrides'
import typography from './typography'

interface Props {
  settings: Settings
  children: ReactNode
}

const ThemeComponent = (props: Props) => {
  const { settings, children } = props

  const coreThemeConfig = themeOptions(settings)

  let theme = createTheme(coreThemeConfig)

  theme = createTheme(theme, {
    components: { ...overrides(theme) },
    typography: { ...typography(theme) }
  })

  if (themeConfig.responsiveFontSizes) {
    theme = responsiveFontSizes(theme)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={() => GlobalStyling(theme) as any} />
      <UtilsProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            success: {
              style: {
                background: theme.palette.success.main,
                color: theme.palette.success.contrastText
              }
            },
            error: {
              style: {
                background: theme.palette.error.main,
                color: theme.palette.error.contrastText
              }
            },
            custom: {
              style: {
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }
            },
          }}
        />
        {children}
      </UtilsProvider>
    </ThemeProvider>
  )
}

export default ThemeComponent
