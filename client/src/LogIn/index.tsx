import { FC } from 'react'
import { Link } from 'react-router-dom'
import LogInForm from './LogInForm'

const LogIn: FC = () => {
  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-8 col-md-7 col-lg-6 col-xl-5 col-xxl-4">
            <h1 className="text-center mb-4">Gymrats</h1>

            <LogInForm />

            <p className="text-center">
              Don't have an account yet? <Link to="/signup">Sign up</Link>
            </p>

            <p className="small text-muted text-center mb-3">
              <Link className="text-reset" to="/signup">
                Reset password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogIn
