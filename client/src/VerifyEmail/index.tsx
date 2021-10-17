import { FC, useEffect, useState } from 'react'
import Loader from '../shared/Loader'
import Wrapper from '../shared/Wrapper'
import useQuery from '../shared/useQuery'

const VerifyEmail: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const query = useQuery('token')

  useEffect(() => {
    setLoading(true)
    setError(undefined)

    if (!query) {
    }
  }, [query])

  if (loading) {
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    )
  }

  return <Wrapper>{error && error}</Wrapper>
}

export default VerifyEmail
