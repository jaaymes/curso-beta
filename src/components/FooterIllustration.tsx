import { Fragment, ReactNode, useState } from 'react'

import Image from 'next/image'

import { Box } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

interface FooterIllustrationsProp {
  image1?: ReactNode
  image2?: ReactNode
}

const MaskImg = styled('img')(() => ({
  bottom: 0,
  zIndex: -1,
  width: '100%',
  position: 'absolute'
}))

const Tree1Img = styled(Image)(() => ({
  left: 0,
  bottom: 0,
  position: 'absolute'
}))

const Tree2Img = styled(Image)(() => ({
  right: -60,
  bottom: 0,
  position: 'absolute'
}))

const FooterIllustrations = (props: FooterIllustrationsProp) => {
  const { image1, image2 } = props
  const [isLoading1, setLoading1] = useState(true)
  const [isLoading2, setLoading2] = useState(true)

  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  if (!hidden) {
    return (
      <Fragment>
        {image1 ||
          <Box
            sx={{
              left: 0,
              bottom: 0,
              position: 'absolute',
              filter: isLoading1 ? 'blur(20px)' : 'none',
            }}
          >
            <Tree1Img priority={true} height={400} width={400} alt='tree' src='/images/auth-tree.png' onLoadingComplete={() => setLoading1(false)} />
          </Box>
        }
        <MaskImg alt='mask' src={`/images/auth-mask-${theme.palette.mode}.png`} />
        {image2 ||
          <Box
            sx={{
              right: -60,
              bottom: 0,
              position: 'absolute',
              filter: isLoading2 ? 'blur(20px)' : 'none',
            }}
          >
            <Tree2Img priority={true} height={400} width={500} alt='tree2' src='/images/auth-tree-2.png' onLoadingComplete={() => setLoading2(false)} />
          </Box>
        }
      </Fragment>
    )
  } else {
    return null
  }
}

export default FooterIllustrations
