import { FC, useState, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { authContext } from '../shared/AuthContext'
import Alert from '../shared/Alert'
import Loader from '../shared/Loader'

const LogInForm: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { user, updateToken } = useContext(authContext)

  const logIn = async () => {
    try {
      setLoading(() => true)
      setError(() => undefined)

      if (!updateToken) {
        setError(() => 'Could not log in, please try again')
        setLoading(() => false)
        return
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(() => data.error)
        setLoading(() => false)
        return
      }

      const tokenFromResponse = data.token

      if (!tokenFromResponse) {
        setError(() => 'Could not log in, please try again')
        setLoading(() => false)
        return
      }

      updateToken(tokenFromResponse)
    } catch (error) {
      setError(() => 'Could not log in, please try again')
    } finally {
      setLoading(() => false)
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
        <Alert
          type="danger"
          message={error}
          onDismiss={setError ? () => setError(() => undefined) : undefined}
        />
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
          onChange={event => setEmail(() => event.target.value)}
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
          onChange={event => setPassword(() => event.target.value)}
        />
      </div>

      <button className="btn btn-primary d-block w-100" onClick={() => logIn()}>
        Log in
      </button>
    </div>
  )
}

export default LogInForm
