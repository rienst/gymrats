import express from 'express'
import ApiError from '../abstracts/ApiError'
import AuthController from '../controllers/AuthController'
import checkCredentials from '../middleware/checkCredentials'
import User from '../models/User'

const router = express.Router()

router.get('/', AuthController.getAuthenticatedUser)
router.post('/', AuthController.authenticateUser)

router.post('/send-verification-email', async (request, response, next) => {
  try {
    if (!request.user) {
      throw new ApiError('Please log in', 403)
    }

    const emailWasSent = request.user.sendVerificationEmail()

    return response.json({ message: 'The verification email has been sent' })
  } catch (error) {
    return next(error)
  }
})

router.post('/verify-email', async (request, response, next) => {
  try {
    if (!request.body.token) {
      throw new ApiError('Please provide a verification token', 400)
    }

    const emailWasVerified = await User.verifyEmail(request.body.token)

    if (!emailWasVerified) {
      throw new ApiError('Could not verify your email address', 400)
    }

    return response.json({ message: 'Your email address has been verified' })
  } catch (error) {
    return next(error)
  }
})

export default router
