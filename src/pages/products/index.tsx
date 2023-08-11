import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

import { useRouter } from "next/router"

import Table from "@/components/Table"
import { usePagination } from "@/hooks/usePagination"
import { IProducts } from "@/interfaces/products"
import { IUser } from "@/interfaces/users"
import { handleRemoveProduct } from "@/lib/product"
import { fCurrency } from "@/utils/formatNumber"
import { useLazyQuery } from "@apollo/client"
import { DeleteOutlineSharp, EditSharp } from "@mui/icons-material"
import { Avatar, IconButton, Tooltip } from "@mui/material"

import { GET_ALL_PRODUCTS, SEARCH_PRODUCTS } from "../api/graphql/queries"

const headers = [
  {
    id: 'thumbnail',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'title',
    label: 'Nome',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'category',
    label: 'Categoria',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'price',
    label: 'Preço',
    numeric: false,
    disablePadding: false,
  },
]

const handleTraitResponse = (data: IProducts[]) => {
  return data.map((d) => ({
    ...d,
    thumbnail: <Avatar src={d.thumbnail} sx={{
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    }} />,
    price: `${fCurrency(String(d.price))}`,
  }))
}

const Products = () => {
  const router = useRouter()
  const { setLimit, setSkip, setTotal, limit, skip } = usePagination()

  const [allProducts, { data, loading, refetch }] = useLazyQuery(GET_ALL_PRODUCTS);
  const [searchProducts, { data: productsFiltered }] = useLazyQuery(SEARCH_PRODUCTS);

  const [products, setProducts] = useState<IProducts[]>([])

  const handleSearch = async (value: string | null) => {
    if (!value) {
      setProducts(data?.allProducts.products)
      return
    }
    await searchProducts({
      variables: {
        q: value
      }
    })
  }

  const handleLoadData = useCallback(async () => {
    await allProducts({
      variables: {
        limit,
        skip
      }
    })
  }, [allProducts, limit, skip])

  useEffect(() => {
    if (productsFiltered) {
      setProducts(productsFiltered?.searchProducts)
    }
  }, [productsFiltered])

  useEffect(() => {
    handleLoadData()
  }, [handleLoadData])

  useEffect(() => {
    if (data) {
      setProducts(data?.allProducts.products)
      setLimit(data?.allProducts.limit)
      setSkip(data?.allProducts.skip)
      setTotal(data?.allProducts.total)
    }
  }, [data, setLimit, setSkip, setTotal])

  return (
    <Table
      add="/products/create"
      loading={loading}
      traitResponse={handleTraitResponse}
      title="Produtos"
      headers={headers}
      data={products}
      search={handleSearch}
      actions={(data: IUser) => {
        return (
          <>
            <Tooltip title="Visualizar" arrow placement="top">
              <IconButton
                onClick={() => {
                  router.push(`/products/create?id=${data.id}`)
                }}
              >
                <EditSharp color="info" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remover" arrow placement="top">
              <IconButton
                onClick={async () => {
                  handleRemoveProduct(data.id)
                  await refetch()
                  toast.success('Usuário removido com sucesso!')
                }}
              >
                <DeleteOutlineSharp color="error" />
              </IconButton>
            </Tooltip>
          </>
        )
      }}
    />
  )
}

export default Products