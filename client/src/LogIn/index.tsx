import { FC } from 'react'
import { Link } from 'react-router-dom'
import Wrapper from '../shared/Wrapper'
import LogInForm from './LogInForm'

const LogIn: FC = () => {
  return (
    <Wrapper>
      <h1 className="text-center">Gymrats</h1>

      <LogInForm />

      <p className="text-center">
        Don't have an account yet? <Link to="/sign-up">Sign up</Link>
      </p>

      <p className="small text-muted text-center mb-3">
        <Link className="text-reset" to="/sign-up">
          Reset password
        </Link>
      </p>
    </Wrapper>
  )
}

export default LogIn
