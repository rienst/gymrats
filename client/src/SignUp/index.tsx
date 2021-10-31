import { FC } from 'react'
import { Link, Redirect } from 'react-router-dom'
import useAuth from '../shared/useAuth'
import Wrapper from '../shared/Wrapper'
import LogoBanner from '../shared/LogoBanner'
import SignUpForm from './SignUpForm'

const SignUp: FC = () => {
  const { user } = useAuth()

  if (user) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Wrapper>
      <LogoBanner />

      <div className="mb-4">
        <SignUpForm />
      </div>

      <p className="text-center mb-0">
        Already have an account? <Link to="/log-in">Log in</Link>
      </p>
    </Wrapper>
  )
}

export default SignUp
