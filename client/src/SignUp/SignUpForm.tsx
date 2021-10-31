import { FC, useState, ChangeEvent } from 'react'
import useAuth from '../shared/useAuth'
import { postUser, ValidationErrors } from '../shared/serverUtilities'
import Alert from '../shared/Alert'
import Form, { Field } from '../shared/Form'
import Button from '../shared/Button'

const SignUpForm: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | false>(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
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

  const handleSignUp = async () => {
    try {
      setLoading(true)
      setError(false)
      setValidationErrors({})

      const response = await postUser(email, password)

      if (response.error) {
        setError(response.error)
        setLoading(false)

        if (!response.validationErrors) {
          return
        }

        setValidationErrors(response.validationErrors)

        return
      }

      if (!response.token) {
        setError('Could not sign up, please try again')
        setLoading(false)
        return
      }

      setToken(response.token)
    } catch (error) {
      setError('Could not sign up, please try again')
      setValidationErrors({})
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
          error={validationErrors.email}
        />

        <Field
          label="Password"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleSetPassword}
          error={validationErrors.password}
        />

        <Button
          variant="outline-primary"
          block
          onClick={handleSignUp}
          loading={loading}
        >
          Sign up
        </Button>
      </Form>
    </>
  )
}

export default SignUpForm
