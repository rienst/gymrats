import { FC, useState, ChangeEvent } from 'react'
import { postSendResetPasswordEmailRequest } from '../shared/serverUtilities'
import Alert from '../shared/Alert'
import Loader from '../shared/Loader'

const ForgotPasswordForm: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | false>(false)
  const [message, setMessage] = useState<string | false>(false)
  const [email, setEmail] = useState('')

  const handleClearError = () => {
    setError(false)
  }

  const handleClearMessage = () => {
    setMessage(false)
  }

  const handleSetEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleSendResetPasswordEmail = async () => {
    try {
      setLoading(true)
      setError(false)
      setMessage(false)

      await new Promise(resolve => setTimeout(resolve, 500))

      const response = await postSendResetPasswordEmailRequest(email)

      if (response.error) {
        setError(response.error)
        setLoading(false)
        return
      }

      setMessage("We've sent you an email")
    } catch (error) {
      setError('Could not send email')
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

      {message && (
        <Alert type="success" onDismiss={handleClearMessage}>
          {message}
        </Alert>
      )}

      <div className="input-group mb-3">
        <input
          className="form-control"
          placeholder="Email"
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleSetEmail}
        />

        <button
          className="btn btn-primary"
          onClick={handleSendResetPasswordEmail}
        >
          Send
        </button>
      </div>
    </>
  )
}

export default ForgotPasswordForm
