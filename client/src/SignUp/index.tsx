import { FC } from 'react'
import { Link, Redirect } from 'react-router-dom'
import useAuth from '../shared/useAuth'
import Wrapper from '../shared/Wrapper'
import SignUpForm from './SignUpForm'

const SignUp: FC = () => {
  const { user } = useAuth()

  if (user) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Wrapper>
      <h1 className="text-center">Gymrats</h1>

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
