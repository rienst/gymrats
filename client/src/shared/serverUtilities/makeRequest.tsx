import { User } from './index'

interface RequestDetails {
  method: 'get' | 'post' | 'patch' | 'delete'
  endpoint: string
  token?: string
  body?: any
}

export interface ResponseData {
  error?: string
  message?: string
  token?: string
  user?: User
}

const makeRequest = async (requestDetails: RequestDetails) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (requestDetails.token) {
    headers.Authorization = requestDetails.token
  }

  const response = await fetch(
    process.env.REACT_APP_API_BASE_URL + requestDetails.endpoint,
    {
      method: requestDetails.method,
      headers,
      body: JSON.stringify(requestDetails.body),
    }
  )

  const data: ResponseData = await response.json()

  return data
}

export default makeRequest
