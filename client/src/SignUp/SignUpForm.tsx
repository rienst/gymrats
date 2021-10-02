import { FC, useState, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { authContext } from '../shared/AuthContext'
import Alert from '../shared/Alert'
import Loader from '../shared/Loader'

const SignUpForm: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [validationErrors, setValidationErrors] = useState<{
    email?: string
    password?: string
  }>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { user, updateToken } = useContext(authContext)

  const signUp = async () => {
    try {
      setError(() => undefined)
      setValidationErrors(() => undefined)
      setLoading(() => true)

      if (!updateToken) {
        setError(() => 'Could not sign up, please try again')
        setLoading(() => false)
        return
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users`,
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
        setValidationErrors(() => data.validationErrors)
        setLoading(() => false)
      }

      const tokenFromResponse = data.token

      if (!tokenFromResponse) {
        setError(() => 'Could not sign up, please try again')
        setLoading(() => false)
        return
      }

      updateToken(tokenFromResponse)
    } catch (error) {
      setError(() => 'Could not sign up, please try again')
      setValidationErrors(() => undefined)
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
          className={`form-control${
            validationErrors && validationErrors.email ? ' is-invalid' : ''
          }`}
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={event => setEmail(() => event.target.value)}
        />
        {validationErrors && validationErrors.email && (
          <div className="invalid-feedback">{validationErrors.email}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="password">
          Password
        </label>
        <input
          className={`form-control${
            validationErrors && validationErrors.password ? ' is-invalid' : ''
          }`}
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={event => setPassword(() => event.target.value)}
        />
        {validationErrors && validationErrors.password && (
          <div className="invalid-feedback">{validationErrors.password}</div>
        )}
      </div>

      <button
        className="btn btn-outline-primary d-block w-100"
        onClick={() => signUp()}
      >
        Sign up
      </button>
    </div>
  )
}

export default SignUpForm
