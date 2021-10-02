import { FC, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { authContext } from '../shared/AuthContext'
import ResendVerificationEmail from './ResendVerificationEmail'

const NotVerified: FC = () => {
  const { user, updateToken } = useContext(authContext)

  if (!user) {
    return <Redirect to="/login" />
  }

  if (user.isVerified) {
    return <Redirect to="/dashboard" />
  }

  return (
    <div className="text-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-8 col-md-7 col-lg-6 col-xl-5 col-xxl-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="icon icon-lg mb-3"
            >
              <path d="M13 17.5a1 1 0 11-2 0 1 1 0 012 0zm-.25-8.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z"></path>
              <path
                fill-rule="evenodd"
                d="M9.836 3.244c.963-1.665 3.365-1.665 4.328 0l8.967 15.504c.963 1.667-.24 3.752-2.165 3.752H3.034c-1.926 0-3.128-2.085-2.165-3.752L9.836 3.244zm3.03.751a1 1 0 00-1.732 0L2.168 19.499A1 1 0 003.034 21h17.932a1 1 0 00.866-1.5L12.866 3.994z"
              ></path>
            </svg>

            <h1 className="h4">
              Your email address is not yet verified. We have sent you an email
              with a verification link.
            </h1>

            <div className="mb-3">
              <ResendVerificationEmail />
            </div>

            <p className="mb-0">
              <button
                className="btn btn-link"
                onClick={updateToken ? () => updateToken() : undefined}
              >
                Log out
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotVerified
