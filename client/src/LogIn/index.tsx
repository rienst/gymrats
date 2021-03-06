import { FC } from 'react'
import { Link, Redirect } from 'react-router-dom'
import useAuth from '../shared/useAuth'
import Wrapper from '../shared/Wrapper'
import LogoBanner from '../shared/LogoBanner'
import LogInForm from './LogInForm'

const LogIn: FC = () => {
  const { user } = useAuth()

  if (user) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Wrapper>
      <LogoBanner />

      <div className="mb-4">
        <LogInForm />
      </div>

      <p className="text-center">
        Don't have an account yet? <Link to="/sign-up">Sign up</Link>
      </p>

      <p className="small text-muted text-center mb-3">
        <Link className="text-reset" to="/forgot-password">
          Forgot your password?
        </Link>
      </p>
    </Wrapper>
  )
}

export default LogIn
