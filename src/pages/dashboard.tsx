import UserLayout from "@/layouts/admin"
import { ReactNode } from "react"

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}

Dashboard.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export default Dashboard