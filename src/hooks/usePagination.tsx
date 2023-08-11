import {
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'


interface PaginationContextData {
  skip: number
  limit: number
  total: number
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
  setTotal: (total: number) => void
}

const Pagination = createContext<PaginationContextData>({} as PaginationContextData)

export const PaginationProvider: React.FC<IContextProvider> = ({ children }) => {
  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)

  const contextValue = useMemo(() => ({
    skip,
    limit,
    setSkip,
    setLimit,
    total,
    setTotal
  }), [skip, limit, total])

  return (
    <Pagination.Provider
      value={contextValue}
    >
      {children}
    </Pagination.Provider>
  )
}

export const usePagination = (): PaginationContextData => {
  const context = useContext(Pagination)

  if (!context) {
    throw new Error('The hook usePagination must be used within an PaginationProvider')
  }

  return context
}
