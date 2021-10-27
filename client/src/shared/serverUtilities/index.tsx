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
  email?: string,
  password?: string
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

export const postUser = async (email?: string, password?: string) => {
  return await makeRequest({
    method: 'post',
    endpoint: '/users',
    body: { email, password },
  })
}

export const postSendVerificationEmailRequest = async (token?: string) => {
  return await makeRequest({
    method: 'post',
    endpoint: '/auth/send-verification-email',
    token,
  })
}

export const postVerifyEmail = async (token?: string) => {
  return await makeRequest({
    method: 'post',
    endpoint: '/auth/verify-email',
    body: { token },
  })
}

export const postSendResetPasswordEmailRequest = async (email?: string) => {
  return await makeRequest({
    method: 'post',
    endpoint: '/auth/send-reset-password-email',
    body: { email },
  })
}

export const postResetPasswordRequest = async (
  token?: string,
  newPassword?: string
) => {
  return await makeRequest({
    method: 'post',
    endpoint: '/auth/reset-password',
    body: { token, newPassword },
  })
}

export * from './makeRequest'
