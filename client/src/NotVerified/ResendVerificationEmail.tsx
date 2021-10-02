import { FC, useContext, useState } from 'react'
import { authContext } from '../shared/AuthContext'
import Loader from '../shared/Loader'
import Alert from '../shared/Alert'

const ResendVerificationEmail: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [message, setMessage] = useState<string>()
  const { token } = useContext(authContext)

  const resendVerificationEmail = async () => {
    try {
      setLoading(() => true)
      setError(() => undefined)
      setMessage(() => undefined)

      if (!token) {
        setLoading(() => false)
        return
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/send-verification-email`,
        {
          method: 'post',
          headers: {
            Authorization: token,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(() => data.error)
        setLoading(() => false)
        return
      }

      setMessage(() => 'A verification email has been sent')
    } catch (error) {
      setError(() => 'Could not send verification email')
    } finally {
      setLoading(() => false)
    }
  }

  return (
    <div>
      {!message && (
        <button
          className="btn btn-primary"
          onClick={() => resendVerificationEmail()}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Loading...</span>Sending
              email...
            </>
          ) : (
            'Resend verification email'
          )}
        </button>
      )}

      {error && <p className="text-danger mt-1 mb-0">{error}</p>}
      {message && <p className="text-success mb-0">{message}</p>}
    </div>
  )
}

export default ResendVerificationEmail
