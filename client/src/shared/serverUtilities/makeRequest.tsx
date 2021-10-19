import { User } from './index'

interface RequestDetails {
  method: 'get' | 'post' | 'patch' | 'delete'
  endpoint: string
  token?: string
  body?: any
}

interface ResponseData {
  error?: string
  message?: string
  token?: string
  user?: User
}

const makeRequest = async (requestDetails: RequestDetails) => {
  const headers: HeadersInit = {
    method: requestDetails.method,
    'Content-Type': 'application/json',
  }

  if (requestDetails.token) {
    headers.Authorization = requestDetails.token
  }

  const response = await fetch(
    process.env.REACT_APP_API_BASE_URL + requestDetails.endpoint,
    {
      headers,
      body: JSON.stringify(requestDetails.body),
    }
  )

  const data: ResponseData = await response.json()

  return data
}

export default makeRequest
