import Table from "@/components/Table"
import { useUtils } from "@/hooks/useUtils"
import { IUser } from "@/interfaces/users"
import { useEffect, useState } from "react"

import { normalizePhone } from "@/utils/normalize"
import { useLazyQuery, useQuery } from "@apollo/client"
import { RemoveRedEye } from "@mui/icons-material"
import { Avatar, IconButton, Tooltip } from "@mui/material"
import { useRouter } from "next/router"
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
  const { search } = useUtils()
  const router = useRouter()
  const { data, loading } = useQuery(GET_ALL_USERS, {
    variables: {
      limit: 100
    }
  })

  const [searchUsers, { data: usersFiltered }] = useLazyQuery(SEARCH_USERS);

  const [users, setUsers] = useState<IUser[]>([])

  const handleSearch = async (value: string | null) => {
    if (!value) {
      setUsers(data?.users)
      return
    }
    await searchUsers({
      variables: {
        key: 'firstName',
        value: value
      }
    })
  }

  useEffect(() => {
    if (usersFiltered) {
      setUsers(usersFiltered?.searchUsers)
    }
  }, [usersFiltered])

  useEffect(() => {
    if (data) {
      setUsers(data?.users)
    }
  }, [data])


  return (
    <Table
      isLoading={loading}
      traitResponse={handleTraitResponse}
      title="Usuários"
      headers={headers}
      data={search.length > 0 ? usersFiltered : users}
      search={handleSearch}
      actions={(data: IUser) => {
        return (
          <>
            <Tooltip title="Visualizar" arrow placement="top">
              <IconButton
                onClick={() => {
                  router.push(`/users/${data.id}`)
                }}
              >
                <RemoveRedEye />
              </IconButton>
            </Tooltip>
          </>
        )
      }}
    />
  )
}

export default Users