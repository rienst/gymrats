import { FC } from 'react'
import { Link } from 'react-router-dom'
import Wrapper from '../shared/Wrapper'
import LogoBanner from '../shared/LogoBanner'
import ForgotPasswordForm from './ForgotPasswordForm'

const ForgotPassword: FC = () => {
  return (
    <Wrapper>
      <LogoBanner />

      <p className="mb-4">
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
