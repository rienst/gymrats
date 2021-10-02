import { FC, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { authContext } from '../shared/AuthContext'

const Dashboard: FC = () => {
  const { user, updateToken } = useContext(authContext)

  if (!user) {
    return <Redirect to="/login" />
  }

  if (!user.isVerified) {
    return <Redirect to="/not-verified" />
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-8 col-md-7 col-lg-6 col-xl-5 col-xxl-4">
            <p>Logged in as {user.name || user.email}</p>

            <button
              className="btn btn-outline-danger"
              onClick={updateToken ? () => updateToken() : undefined}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
