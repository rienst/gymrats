import { RequestHandler } from 'express'
import ApiError from '../abstracts/ApiError'
import User from '../models/User'

export default class AuthController {
  static getAuthenticatedUser: RequestHandler = async (request, response) => {
    if (!request.user) {
      throw new ApiError('Please log in', 403)
    }

    return response.json({ user: request.user })
  }

  static authenticateUser: RequestHandler = async (request, response) => {
    if (!request.body.email) {
      throw new ApiError('Please provide an email', 400)
    }

    if (!request.body.password) {
      throw new ApiError('Please provide a password', 400)
    }

    const user = await User.checkCredentials(
      request.body.email,
      request.body.password
    )

    if (!user) {
      throw new ApiError(
        'That user could not be found or the password is incorrect',
        403
      )
    }

    const token = user.createToken()

    return response.json({ token })
  }

  static sendVerificationEmail: RequestHandler = async (request, response) => {
    if (!request.user) {
      throw new ApiError('Please log in', 403)
    }

    const emailWasSent = request.user.sendVerificationEmail()

    return response.json({ message: 'The verification email has been sent' })
  }
}
