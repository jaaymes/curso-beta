import { ElementType, ReactNode } from 'react'

import { SvgIconProps } from '@mui/material'

interface UserIconProps {
  iconProps?: SvgIconProps
  icon: string | ReactNode
}

const UserIcon = (props: UserIconProps) => {
  const { icon, iconProps } = props

  const IconTag = icon as ElementType

  return <IconTag {...iconProps} />
}

export default UserIcon
