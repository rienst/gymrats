import { FC, useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Loader from '../shared/Loader'
import useQuery from '../shared/useQuery'
import Alert from '../shared/Alert'
import { postVerifyEmail } from '../shared/serverUtilities'

const VerificationResult: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | false>(false)

  const token = useQuery('token')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true)
        setError(false)

        if (!token) {
          return
        }

        const response = await postVerifyEmail(token)

        if (response.error) {
          setError(response.error)
          setLoading(false)
          return
        }
      } catch (error) {
        setError('Something went wrong verifying your email')
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [token])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  if (!token) {
    return <Redirect to="/welcome" />
  }

  return (
    <>
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="icon icon-lg text-success mb-3"
        >
          <path
            fillRule="evenodd"
            d="M21.03 5.72a.75.75 0 010 1.06l-11.5 11.5a.75.75 0 01-1.072-.012l-5.5-5.75a.75.75 0 111.084-1.036l4.97 5.195L19.97 5.72a.75.75 0 011.06 0z"
          ></path>
        </svg>

        <h1 className="h4">Your email has been verified!</h1>

        <p className="mb-0">
          <Link className="btn btn-primary" to="/dashboard">
            Take me to my dashboard
          </Link>
        </p>
      </div>
    </>
  )
}

export default VerificationResult
