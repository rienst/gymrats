import { FC, useState, ChangeEvent } from 'react'
import useAuth from '../shared/useAuth'
import { getTokenFromCredentials } from '../shared/serverUtilities'
import Alert from '../shared/Alert'
import Form, { Field } from '../shared/Form'
import Button from '../shared/Button'

const LogInForm: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | false>(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setToken } = useAuth()

  const handleClearError = () => {
    setError(false)
  }

  const handleSetEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleSetPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleLogIn = async () => {
    try {
      setLoading(true)
      setError(false)

      await new Promise(resolve => setTimeout(resolve, 500))

      const response = await getTokenFromCredentials(email, password)

      if (response.error || !response.token) {
        setError(response.error ?? 'Could not log in, please try again')
        setLoading(false)
        return
      }

      setToken(response.token)
    } catch (error) {
      setError('Could not log in, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error && (
        <Alert variant="danger" onDismiss={handleClearError}>
          {error}
        </Alert>
      )}

      <Form>
        <Field
          label="Email"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleSetEmail}
        />

        <Field
          label="Password"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleSetPassword}
        />

        <Button block onClick={handleLogIn} loading={loading}>
          Log in
        </Button>
      </Form>
    </>
  )
}

export default LogInForm
