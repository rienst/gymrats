import { FC } from 'react'
import { Link, Redirect } from 'react-router-dom'
import useAuth from '../shared/useAuth'
import ResendVerificationEmail from '../shared/ResendVerificationEmail'
import Wrapper from '../shared/Wrapper'

const Welcome: FC = () => {
  const { user } = useAuth()

  if (!user) {
    return <Redirect to="/log-in" />
  }

  return (
    <Wrapper>
      <div className="text-center">
        <h1 className="h4">Welcome to Gymrats!</h1>

        {!user.isVerified && (
          <>
            <p className="mb-4">
              Please check your inbox to confirm your email address.
            </p>

            <ResendVerificationEmail />
          </>
        )}

        {user.isVerified && (
          <p className="mb-0">
            <Link className="btn btn-primary" to="/dashboard">
              Take me to the dashboard
            </Link>
          </p>
        )}
      </div>
    </Wrapper>
  )
}

export default Welcome
