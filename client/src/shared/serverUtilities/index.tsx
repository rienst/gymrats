import makeRequest from './makeRequest'

export interface User {
  _id: string
  email: string
  name?: string
  isAdmin: boolean
  isVerified: boolean
  __v: number
}

export const getTokenFromCredentials = async (
  email: string,
  password: string
) => {
  return await makeRequest({
    method: 'post',
    endpoint: '/auth',
    body: { email, password },
  })
}

export const getUserFromToken = async (token?: string) => {
  return await makeRequest({
    method: 'get',
    endpoint: '/auth',
    token,
  })
}

export const postSendVerificationMailRequest = async (token?: string) => {
  return await makeRequest({
    method: 'post',
    endpoint: '/auth/send-verification-email',
    token,
  })
}

export * from './makeRequest'
