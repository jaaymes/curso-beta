import api from "@/services/api"


const getAllUsers = async () => {
  const res = await api.get("/users")
  return res.data
}

const handleRemoveUser = async (id: number) => {
  await api.delete(`/users/${id}`)
}

export { getAllUsers, handleRemoveUser }
