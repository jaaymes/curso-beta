import { createContext, useMemo, useState } from 'react'

import { useAuth } from '@/hooks/useAuth'


export interface UtilsContextData {
  search: string
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const UtilsContext = createContext<UtilsContextData>({} as UtilsContextData)

export const UtilsProvider: React.FC<IContextProvider> = ({ children }) => {
  const [search, setSearch] = useState<string>('')
  const [userFeatures, setUserFeatures] = useState<string[]>([])
  const { user } = useAuth()

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const context = useMemo(() => {
    return {
      search,
      handleSearch,
    }
  }, [search])

  return <UtilsContext.Provider value={context}>{children}</UtilsContext.Provider>
}