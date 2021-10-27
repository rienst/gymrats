import { FC } from 'react'
import { Link } from 'react-router-dom'
import Wrapper from '../shared/Wrapper'
import ForgotPasswordForm from './ForgotPasswordForm'

const ForgotPassword: FC = () => {
  return (
    <Wrapper>
      <h1 className="text-center">Gymrats</h1>

      <p>
        Please fill in your email address so we can send you a link to reset
        your password.
      </p>

      <div className="mb-4">
        <ForgotPasswordForm />
      </div>

      <p className="text-center mb-0">
        Remember your password? <Link to="/log-in">Log in</Link>
      </p>
    </Wrapper>
  )
}

export default ForgotPassword
