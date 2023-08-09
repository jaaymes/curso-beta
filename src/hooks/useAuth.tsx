import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import api from '@/services/api'
import { createCookie, eraseAllCookies } from '@/utils/cookie'

interface IUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
}

interface AuthState {
  token: string
}

interface SignInCredentials {
  username: string
  password: string
}

interface AuthContextData {
  user: IUser
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
}

const Auth = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<IContextProvider> = ({ children }) => {
  const [user, setUser] = useState<IUser>({} as IUser)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      api.defaults.headers.Authorization = `Bearer ${token}`

      setUser(JSON.parse(user))
    }
  }, [])

  const signIn = useCallback(
    async ({ username, password }: SignInCredentials) => {
      const response = await api.post('/auth/login', {
        username,
        password,
        expiresInMins: 120 // 2 hours
      })

      api.defaults.headers.Authorization = `Bearer ${response.data.token}`

      createCookie('token', response.data.token, undefined, {
        maxAge: 60 * 60 * 2, // 2 hours
      })

      createCookie('user', JSON.stringify(response.data), undefined, {
        maxAge: 60 * 60 * 2, // 2 hours
      })

      setUser(response.data)
    },
    []
  )

  const signOut = async () => {
    setUser({} as IUser)
    eraseAllCookies()
    window.location.href = '/'
  }

  return (
    <Auth.Provider
      value={{
        user,
        signIn,
        signOut,
      }}
    >
      {children}
    </Auth.Provider>
  )
}

export const useAuth = (): AuthContextData => {
  const context = useContext(Auth)

  if (!context) {
    throw new Error('The hook useAuth must be used within an AuthProvider')
  }

  return context
}
