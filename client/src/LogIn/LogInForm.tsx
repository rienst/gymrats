import { FC, useState, ChangeEvent } from 'react'
import { Redirect } from 'react-router-dom'
import useAuth from '../shared/useAuth'
import { getTokenFromCredentials } from '../shared/serverUtilities'
import Alert from '../shared/Alert'
import Loader from '../shared/Loader'

const LogInForm: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | false>(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { user, setToken } = useAuth()

  const handleClearError = () => {
    setError(false)
  }

  const handleSetEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleSetPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleLogIn = async () => {
    try {
      setLoading(true)
      setError(error)

      await new Promise(resolve => setTimeout(resolve, 500))

      if (!setToken) {
        setError('Could not log in, please try again')
        setLoading(false)
        return
      }

      const response = await getTokenFromCredentials(email, password)

      if (response.error) {
        setError(response.error)
        setLoading(false)
        return
      }

      if (!response.token) {
        setError('Could not log in, please try again')
        setLoading(false)
        return
      }

      setToken(response.token)
    } catch (error) {
      setError('Could not log in, please try again')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mb-4">
        <Loader />
      </div>
    )
  }

  if (user) {
    return <Redirect to="/dashboard" />
  }

  return (
    <div className="mb-4">
      {error && (
        <Alert type="danger" message={error} onDismiss={handleClearError} />
      )}

      <div className="mb-3">
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          className="form-control"
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleSetEmail}
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="password">
          Password
        </label>
        <input
          className="form-control"
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleSetPassword}
        />
      </div>

      <button className="btn btn-primary d-block w-100" onClick={handleLogIn}>
        Log in
      </button>
    </div>
  )
}

export default LogInForm
