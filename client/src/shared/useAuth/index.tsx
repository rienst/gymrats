import React, {
  FC,
  createContext,
  useEffect,
  useState,
  useContext,
} from 'react'
import { User } from '../../types'
import Loader from '../Loader'

type AuthContextProps = {
  user?: User
  token?: string
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>
}

const authContext = createContext<Partial<AuthContextProps>>({})

const useAuth = () => useContext(authContext)

export default useAuth

export const AuthProvider: FC = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string>()
  const [user, setUser] = useState<User>()

  const tokenLocalStorageKey = process.env.REACT_APP_LS_TOKEN_KEY || 'token'

  const getUserFromDatabase = async (token: string) => {
    setLoading(true)

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth`, {
      headers: {
        Authorization: token,
      },
    })

    const data = await response.json()

    if (!response.ok || !data.user) {
      setUser(undefined)
      return false
    }

    const user: User = data.user

    setUser(user)
    setLoading(false)
  }

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem(tokenLocalStorageKey)

    if (!tokenFromLocalStorage) {
      setLoading(false)
      return
    }

    setToken(tokenFromLocalStorage)

    getUserFromDatabase(tokenFromLocalStorage)
  }, [tokenLocalStorageKey])

  useEffect(() => {
    if (!token) {
      localStorage.removeItem(tokenLocalStorageKey)
      return
    }

    localStorage.setItem(tokenLocalStorageKey, token)

    getUserFromDatabase(token)
  }, [token, tokenLocalStorageKey])

  useEffect(() => {
    console.log(loading, token, user)
  })

  const value = {
    user,
    token,
    setToken,
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Loader />
      </div>
    )
  }

  return <authContext.Provider value={value}>{children}</authContext.Provider>
}
