import { FC, useState } from 'react'
import { Redirect } from 'react-router-dom'
import useAuth from '../shared/useAuth'
import Alert from '../shared/Alert'
import Loader from '../shared/Loader'

const SignUpForm: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | false>(false)
  const [validationErrors, setValidationErrors] = useState<
    | {
        email?: string
        password?: string
      }
    | false
  >(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { user, setToken } = useAuth()

  const signUp = async () => {
    try {
      setError(false)
      setValidationErrors(false)
      setLoading(true)

      if (!setToken) {
        setError('Could not sign up, please try again')
        setLoading(false)
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
        setError(data.error)
        setValidationErrors(data.validationErrors)
        setLoading(false)
        return
      }

      const tokenFromResponse = data.token

      if (!tokenFromResponse) {
        setError('Could not sign up, please try again')
        setLoading(false)
        return
      }

      setToken(tokenFromResponse)
    } catch (error) {
      setError('Could not sign up, please try again')
      setValidationErrors(false)
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
        <Alert
          type="danger"
          message={error}
          onDismiss={setError ? () => setError(false) : undefined}
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
