import express from 'express'
import {
  getUserFromToken,
  getTokenFromCredentials,
  sendVerificationEmail,
  verifyEmail,
} from '../controllers/authControllers'

const authRouter = express.Router()

authRouter.get('/', getUserFromToken)
authRouter.post('/', getTokenFromCredentials)
authRouter.post('/send-verification-email', sendVerificationEmail)
authRouter.post('/verify-email', verifyEmail)

export default authRouter
