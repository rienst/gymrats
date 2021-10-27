import { FC, useState } from 'react'
import useAuth from '../useAuth'

const ResendVerificationEmail: FC = () => {
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
      {!message && (
        <button
          className="btn btn-primary"
          onClick={handleResendVerificationEmail}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
              Sending email...
            </>
          ) : (
            'Resend verification email'
          )}
        </button>
      )}

      {message && <p className="text-success mb-0">{message}</p>}
      {error && <p className="text-danger mt-1 mb-0">{error}</p>}
    </>
  )
}

export default ResendVerificationEmail
