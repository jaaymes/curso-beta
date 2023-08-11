import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

import { useRouter } from "next/router"

import Table from "@/components/Table"
import { usePagination } from "@/hooks/usePagination"
import { IUser } from "@/interfaces/users"
import { handleRemoveUser } from "@/lib/users"
import { normalizePhone } from "@/utils/normalize"
import { useLazyQuery } from "@apollo/client"
import { DeleteOutlineSharp, EditSharp } from "@mui/icons-material"
import { Avatar, IconButton, Tooltip } from "@mui/material"

import { GET_ALL_USERS, SEARCH_USERS } from "../api/graphql/queries"

const headers = [
  {
    id: 'image',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'firstName',
    label: 'Nome',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'age',
    label: 'Idade',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'phone',
    label: 'Telefone',
    numeric: false,
    disablePadding: false,
  },
]

const handleTraitResponse = (data: IUser[]) => {
  return data.map((d) => ({
    ...d,
    image: <Avatar src={d.image} sx={{
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    }} />,
    phone: normalizePhone(d.phone),
  }))
}

const Users = () => {
  const router = useRouter()
  const { setLimit, setSkip, setTotal, limit, skip } = usePagination()

  const [allUsers, { data, loading, refetch }] = useLazyQuery(GET_ALL_USERS);
  const [searchUsers, { data: usersFiltered }] = useLazyQuery(SEARCH_USERS);

  const [users, setUsers] = useState<IUser[]>([])

  const handleSearch = async (value: string | null) => {
    if (!value) {
      setUsers(data?.allUsers.users)
      return
    }
    await searchUsers({
      variables: {
        q: value
      }
    })
  }

  const handleLoadData = useCallback(async () => {
    await allUsers({
      variables: {
        limit,
        skip
      }
    })
  }, [allUsers, limit, skip])

  useEffect(() => {
    if (usersFiltered) {
      setUsers(usersFiltered?.searchUsers)
    }
  }, [usersFiltered])

  useEffect(() => {
    handleLoadData()
  }, [handleLoadData])

  useEffect(() => {
    if (data) {
      setUsers(data?.allUsers.users)
      setLimit(data?.allUsers.limit)
      setSkip(data?.allUsers.skip)
      setTotal(data?.allUsers.total)
    }
  }, [data, setLimit, setSkip, setTotal])

  return (
    <Table
      add="/users/create"
      loading={loading}
      traitResponse={handleTraitResponse}
      title="Usuários"
      headers={headers}
      data={users}
      search={handleSearch}
      actions={(data: IUser) => {
        return (
          <>
            <Tooltip title="Visualizar" arrow placement="top">
              <IconButton
                onClick={() => {
                  router.push(`/users/create?id=${data.id}`)
                }}
              >
                <EditSharp color="info" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remover" arrow placement="top">
              <IconButton
                onClick={async () => {
                  handleRemoveUser(data.id)
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

export default Users