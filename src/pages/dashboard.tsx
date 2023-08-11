import { ReactNode } from "react"

import { BlurImage } from "@/components/BlurImage"
import UserLayout from "@/layouts/admin"
import { Box } from "@mui/material"

const Dashboard = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      height='100%'
      width='100%'
    >
      <BlurImage
        src="/images/Logo.webp"
        name="Logo"
        height={200}
        width={600}
      />
    </Box>
  )
}

Dashboard.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export default Dashboard