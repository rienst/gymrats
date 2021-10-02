import { FC, createContext, useEffect, useState } from 'react'
import { User } from '../../types'
import Loader from '../Loader'

type AuthContextProps = {
  user?: User
  token?: string
  updateToken: (token?: string) => void
}

export const authContext = createContext<Partial<AuthContextProps>>({})

const AuthProvider: FC = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string>()
  const [user, setUser] = useState()

  const updateToken = (token?: string) => {
    setToken(() => token)
  }

  useEffect(() => {
    setLoading(true)

    if (!process.env.REACT_APP_LOCALSTORAGE_TOKEN_KEY) {
      return
    }

    const tokenFromStorage = localStorage.getItem(
      process.env.REACT_APP_LOCALSTORAGE_TOKEN_KEY
    )

    if (!tokenFromStorage) {
      return
    }

    setToken(() => tokenFromStorage)
    setLoading(() => false)
  }, [])

  useEffect(() => {
    if (loading) {
      return
    }

    if (!process.env.REACT_APP_LOCALSTORAGE_TOKEN_KEY) {
      return
    }

    if (!token) {
      localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN_KEY)
      setUser(() => undefined)
      return
    }

    localStorage.setItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN_KEY, token)
  }, [loading, token])

  useEffect(() => {
    setLoading(() => true)

    const authenticate = async () => {
      try {
        if (!token) {
          setUser(() => undefined)
          setLoading(() => false)
          return
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/auth`,
          {
            headers: {
              Authorization: token,
            },
          }
        )

        const data = await response.json()

        if (!response.ok || !data.user) {
          setToken(() => undefined)
          setUser(() => undefined)
          setLoading(() => false)
          return
        }

        setUser(() => data.user)
      } catch (error) {
        setToken(() => undefined)
        setUser(() => undefined)
      } finally {
        setLoading(() => false)
      }
    }

    authenticate()
  }, [token])

  const value = {
    user,
    token,
    updateToken,
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

export default AuthProvider
