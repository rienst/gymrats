import { FC } from 'react'
import Wrapper from '../shared/Wrapper'
import ResetPasswordForm from './ResetPasswordForm'

const ResetPassword: FC = () => {
  return (
    <Wrapper>
      <h1 className="text-center">Gymrats</h1>

      <ResetPasswordForm />
    </Wrapper>
  )
}

export default ResetPassword
