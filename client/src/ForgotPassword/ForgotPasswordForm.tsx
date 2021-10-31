import { FC, useState, ChangeEvent } from 'react'
import { postSendResetPasswordEmailRequest } from '../shared/serverUtilities'
import Alert from '../shared/Alert'
import Form, { Field } from '../shared/Form'
import Button from '../shared/Button'

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

  return (
    <>
      {error && (
        <Alert variant="danger" onDismiss={handleClearError}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert variant="success" onDismiss={handleClearMessage}>
          {message}
        </Alert>
      )}

      <Form>
        <Field
          label="Email"
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleSetEmail}
        />

        <Button block onClick={handleSendResetPasswordEmail} loading={loading}>
          Send password reset link
        </Button>
      </Form>
    </>
  )
}

export default ForgotPasswordForm
