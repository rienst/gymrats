import { FC } from 'react'
import { Redirect } from 'react-router-dom'
import useAuth from '../shared/useAuth'
import Wrapper from '../shared/Wrapper'

const Dashboard: FC = () => {
  const { user, setToken } = useAuth()

  const handleLogOut = () => {
    setToken(undefined)
  }

  if (!user) {
    return <Redirect to="/log-in" />
  }

  if (!user.isVerified) {
    return <Redirect to="/welcome" />
  }

  return (
    <Wrapper>
      <p>Logged in as {user.name || user.email}</p>

      <button className="btn btn-outline-danger" onClick={handleLogOut}>
        Log out
      </button>
    </Wrapper>
  )
}

export default Dashboard
