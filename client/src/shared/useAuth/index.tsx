import React, {
  FC,
  createContext,
  useEffect,
  useState,
  useContext,
} from 'react'
import Loader from '../Loader'
import {
  getUserFromToken,
  postSendVerificationEmailRequest,
  ResponseData,
} from '../serverUtilities'

export interface User {
  _id: string
  email: string
  name?: string
  isAdmin: boolean
  isVerified: boolean
  __v: number
}

interface AuthContextProps {
  user?: User
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>
  sendVerificationEmail: () => Promise<ResponseData>
}

const authContext = createContext<AuthContextProps>(
  null as any as AuthContextProps
)

const useAuth = () => useContext(authContext)

export const AuthProvider: FC = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string>()
  const [user, setUser] = useState<User>()

  const tokenLocalStorageKey = process.env.REACT_APP_LS_TOKEN_KEY || 'token'

  const sendVerificationEmail = async () => {
    return await postSendVerificationEmailRequest(token)
  }

  const setUserFromToken = async (token: string) => {
    setLoading(true)

    const response = await getUserFromToken(token)

    if (response.error || !response.user) {
      setUser(undefined)
      setToken(undefined)
      setLoading(false)
      return
    }

    setUser(response.user)
    setLoading(false)
  }

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem(tokenLocalStorageKey)

    if (!tokenFromLocalStorage) {
      setLoading(false)
      return
    }

    setToken(tokenFromLocalStorage)

    setUserFromToken(tokenFromLocalStorage)
  }, [tokenLocalStorageKey])

  useEffect(() => {
    if (!token) {
      localStorage.removeItem(tokenLocalStorageKey)
      setUser(undefined)
      return
    }

    localStorage.setItem(tokenLocalStorageKey, token)

    setUserFromToken(token)
  }, [token, tokenLocalStorageKey])

  const value = {
    user,
    setToken,
    sendVerificationEmail,
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

export default useAuth
