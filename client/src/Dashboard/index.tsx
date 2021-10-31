import { FC } from 'react'
import { Redirect } from 'react-router-dom'
import useAuth from '../shared/useAuth'
import Wrapper from '../shared/Wrapper'
import LogoBanner from '../shared/LogoBanner'
import Button from '../shared/Button'

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
      <LogoBanner />

      <p>Logged in as {user.name || user.email}</p>

      <Button variant="outline-danger" onClick={handleLogOut}>
        Log out
      </Button>
    </Wrapper>
  )
}

export default Dashboard
