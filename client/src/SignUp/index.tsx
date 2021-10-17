import { FC } from 'react'
import { Link } from 'react-router-dom'
import Wrapper from '../shared/Wrapper'
import SignUpForm from './SignUpForm'

const SignUp: FC = () => {
  return (
    <Wrapper>
      <h1 className="text-center">Gymrats</h1>

      <SignUpForm />

      <p className="text-center">
        Already have an account? <Link to="/log-in">Log in</Link>
      </p>

      <p className="small text-muted text-center mb-3">
        <Link className="text-reset" to="/log-in">
          Reset password
        </Link>
      </p>
    </Wrapper>
  )
}

export default SignUp
