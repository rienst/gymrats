import { useLocation } from 'react-router'

const useQuery = (key: string) => {
  return new URLSearchParams(useLocation().search).get(key)
}

export default useQuery
