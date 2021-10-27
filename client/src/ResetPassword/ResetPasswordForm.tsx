import { FC, useState, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import useQuery from '../shared/useQuery'
import Loader from '../shared/Loader'
import Alert from '../shared/Alert'
import {
  postResetPasswordRequest,
  ValidationErrors,
} from '../shared/serverUtilities'

const ResetPasswordForm: FC = () => {
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | false>(false)
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors | false
  >(false)
  const [success, setSuccess] = useState(false)

  const token = useQuery('token')

  const handleUnsetError = () => {
    setError(false)
  }

  const handleSetPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value)
  }

  const handleResetPassword = () => {
    const resetPassword = async () => {
      try {
        setLoading(true)
        setError(false)
        setValidationErrors(false)
        setSuccess(false)

        if (!token) {
          setLoading(false)
          setError('Could not find a token to validate your request')
          return
        }

        const response = await postResetPasswordRequest(token, newPassword)

        if (response.error) {
          setLoading(false)
          setError(response.error)

          if (!response.validationErrors) {
            return
          }

          setValidationErrors(response.validationErrors)

          return
        }

        setSuccess(true)
      } catch (error) {
        setLoading(false)
        setError('Something went wrong, please try again')
      } finally {
        setLoading(false)
      }
    }

    resetPassword()
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      {error && (
        <Alert type="danger" onDismiss={handleUnsetError}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success">
          <div className="d-flex align-items-center">
            <p className="mb-0 me-2">Your password has been reset</p>
            <p className="ms-auto mb-0">
              <Link to="/log-in" className="btn btn-success text-nowrap">
                Log in
              </Link>
            </p>
          </div>
        </Alert>
      )}

      {!success && (
        <>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              New password
            </label>
            <input
              className={`form-control${
                validationErrors && validationErrors.password
                  ? ' is-invalid'
                  : ''
              }`}
              type="password"
              name="newPassword"
              id="newPassword"
              value={newPassword}
              onChange={handleSetPassword}
            />
            {validationErrors && validationErrors.password && (
              <div className="invalid-feedback">
                {validationErrors.password}
              </div>
            )}
          </div>
          <button
            className="btn btn-primary d-block w-100"
            onClick={handleResetPassword}
          >
            Reset password
          </button>
        </>
      )}
    </>
  )
}

export default ResetPasswordForm
