import { Settings } from '@/context/settingsContext'
import { IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Menu } from 'mdi-material-ui'

import ModeToggler from '../components/shared-components/ModeToggler'
import UserDropdown from '../components/shared-components/UserDropdown'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  const hiddenSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: theme => theme.palette.background.default }}>
      <Box className='actions-left' sx={{ display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton
            color='inherit'
            onClick={toggleNavVisibility}
            sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
          >
            <Menu sx={{ ml: 4 }} />
          </IconButton>
        ) : null}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        <UserDropdown />
      </Box>
    </Box>
  )
}

export default AppBarContent
