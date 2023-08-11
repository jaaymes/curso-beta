import { useState } from "react"

import Image from "next/legacy/image"

import { Box } from "@mui/material"

type ImageProps = {
  height: number
  width: number
  src: string
  name: string
}

const BlurImage = ({ src, height, width, name }: ImageProps) => {
  const [isLoading, setLoading] = useState(true)

  return (
    <Box
      sx={{
        position: 'relative',
        width: width || '100%',
        height: height || '100%',
        overflow: 'hidden',
        filter: isLoading ? 'blur(20px)' : 'none',
      }}
    >
      <Image
        priority={true}
        alt={name}
        src={src}
        layout="fill"
        objectFit="contain"
        quality={100}
        onLoadingComplete={() => setLoading(false)}
      />
    </Box>
  )
}

export { BlurImage }
