import { FC, useState } from 'react'
import Button from '../Button'
import useAuth from '../useAuth'

const ResendVerificationEmailButton: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | false>(false)
  const [message, setMessage] = useState<string | false>(false)
  const { sendVerificationEmail } = useAuth()

  const handleResendVerificationEmail = async () => {
    try {
      setLoading(true)
      setError(false)
      setMessage(false)

      const response = await sendVerificationEmail()

      if (response.error) {
        setError(response.error)
        setLoading(false)
        return
      }

      setMessage('A new verification email has been sent')
    } catch (error) {
      setError('Could not send verification email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!message ? (
        <Button onClick={handleResendVerificationEmail} loading={loading}>
          Resend verification email
        </Button>
      ) : (
        <p className="text-success mb-0">{message}</p>
      )}

      {error && <p className="text-danger mt-1 mb-0">{error}</p>}
    </>
  )
}

export default ResendVerificationEmailButton
