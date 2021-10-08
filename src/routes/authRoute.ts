import express from 'express'
import checkCredentials from '../middleware/checkCredentials'
import User from '../models/User'

const router = express.Router()

router.get('/', async (request, response, next) => {
  try {
    if (!request.user) {
      response.status(403)
      return response.json({ error: 'Please log in' })
    }

    return response.json({ user: request.user })
  } catch (error) {
    return next(error)
  }
})

router.post('/', checkCredentials, async (request, response, next) => {
  try {
    if (!request.user) {
      response.status(403)
      return response.json({ error: 'Please log in' })
    }

    const token = request.user.createToken()

    return response.json({ token })
  } catch (error) {
    return next(error)
  }
})

router.post('/send-verification-email', async (request, response, next) => {
  try {
    if (!request.user) {
      response.status(403)
      return response.json({ error: 'Please log in' })
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
      response.status(400)
      return response.json({ error: 'Please provide a verification token' })
    }

    const emailWasVerified = await User.verifyEmail(request.body.token)

    if (!emailWasVerified) {
      response.status(400)
      return response.json({ error: 'Could not verify your email address' })
    }

    return response.json({ message: 'Your email address has been verified' })
  } catch (error) {
    return next(error)
  }
})

export default router