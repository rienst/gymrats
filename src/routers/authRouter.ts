import express from 'express'
import {
  getUserFromToken,
  getTokenFromCredentials,
  sendVerificationEmail,
  verifyEmail,
  sendResetPasswordEmail,
  resetPassword,
} from '../controllers/authControllers'

const authRouter = express.Router()

authRouter.get('/', getUserFromToken)
authRouter.post('/', getTokenFromCredentials)
authRouter.post('/send-verification-email', sendVerificationEmail)
authRouter.post('/send-reset-password-email', sendResetPasswordEmail)
authRouter.post('/verify-email', verifyEmail)
authRouter.post('/reset-password', resetPassword)

export default authRouter
