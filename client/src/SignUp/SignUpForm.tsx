import { FC, useState, ChangeEvent } from 'react'
import useAuth from '../shared/useAuth'
import { postUser, ValidationErrors } from '../shared/serverUtilities'
import Alert from '../shared/Alert'
import Loader from '../shared/Loader'

const SignUpForm: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | false>(false)
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors | false
  >(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setToken } = useAuth()

  const handleClearError = () => {
    setError(false)
  }

  const handleSetEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleSetPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleSignUp = async () => {
    try {
      setLoading(true)
      setError(false)
      setValidationErrors(false)

      const response = await postUser(email, password)

      if (response.error) {
        setError(response.error)
        setLoading(false)

        if (!response.validationErrors) {
          return
        }

        setValidationErrors(response.validationErrors)

        return
      }

      if (!response.token) {
        setError('Could not sign up, please try again')
        setLoading(false)
        return
      }

      setToken(response.token)
    } catch (error) {
      setError('Could not sign up, please try again')
      setValidationErrors(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      {error && (
        <Alert type="danger" onDismiss={handleClearError}>
          {error}
        </Alert>
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
          onChange={handleSetEmail}
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
          onChange={handleSetPassword}
        />
        {validationErrors && validationErrors.password && (
          <div className="invalid-feedback">{validationErrors.password}</div>
        )}
      </div>

      <button
        className="btn btn-outline-primary d-block w-100"
        onClick={handleSignUp}
      >
        Sign up
      </button>
    </>
  )
}

export default SignUpForm
