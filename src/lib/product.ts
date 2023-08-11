import api from "@/services/api"



const handleRemoveProduct = async (id: number) => {
  await api.delete(`/product/${id}`)
}

export {
  handleRemoveProduct
}
