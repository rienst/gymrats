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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="icon icon-lg mb-3"
        >
          <path
            fillRule="evenodd"
            d="M21.03 5.72a.75.75 0 010 1.06l-11.5 11.5a.75.75 0 01-1.072-.012l-5.5-5.75a.75.75 0 111.084-1.036l4.97 5.195L19.97 5.72a.75.75 0 011.06 0z"
          ></path>
        </svg>

        <h1 className="h4">Welcome to Gymrats!</h1>

        {!user.isVerified && (
          <>
            <p className="mb-4">
              We've sent you an email to confirm your email address.
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
