import { FC, useState, ChangeEvent } from 'react'
import { Link, Redirect } from 'react-router-dom'
import useQuery from '../shared/useQuery'
import Alert from '../shared/Alert'
import Form, { Field } from '../shared/Form'
import Button from '../shared/Button'
import {
  postResetPasswordRequest,
  ValidationErrors,
} from '../shared/serverUtilities'

const ResetPasswordForm: FC = () => {
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | false>(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
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
        setValidationErrors({})
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

  if (!token) {
    return <Redirect to="/forgot-password" />
  }

  return (
    <>
      {error && (
        <Alert variant="danger" onDismiss={handleUnsetError}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success">
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
          <Form>
            <Field
              label="New password"
              type="password"
              name="newPassword"
              id="newPassword"
              value={newPassword}
              onChange={handleSetPassword}
              error={validationErrors.password}
            />

            <Button block onClick={handleResetPassword} loading={loading}>
              Reset password
            </Button>
          </Form>
        </>
      )}
    </>
  )
}

export default ResetPasswordForm
