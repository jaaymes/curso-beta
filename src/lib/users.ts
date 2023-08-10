import api from "@/services/api"


const getAllUsers = async () => {
  const res = await api.get("/users")
  return res.data
}

export { getAllUsers }
