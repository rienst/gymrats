import { RequestHandler } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import server from '../server'
import ApiError from '../abstracts/ApiError'
import User from '../models/User'

export const setRequestUserFromCredentials: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    if (!request.body.email) {
      throw new ApiError('Please provide an email', 400)
    }

    if (!request.body.password) {
      throw new ApiError('Please provide a password', 400)
    }

    const user = await User.findOne({ email: request.body.email })

    if (!user) {
      throw new ApiError('That user was not found', 400)
    }

    const passwordMatch = await user.checkPassword(request.body.password)

    if (!passwordMatch) {
      throw new ApiError('That password is invalid', 400)
    }

    request.user = user

    next()
  } catch (error) {
    return next(error)
  }
}

export const getUserFromToken: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    if (!request.user) {
      throw new ApiError('You are not logged in', 403)
    }

    const userResponseObject = request.user.getResponseObject()

    return response.json({ user: userResponseObject })
  } catch (error) {
    return next(error)
  }
}

export const getTokenFromCredentials: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    if (!request.body.email) {
      throw new ApiError('Please provide an email', 400)
    }

    if (!request.body.password) {
      throw new ApiError('Please provide a password', 400)
    }

    const user = await User.findOne({ email: request.body.email })

    if (!user) {
      throw new ApiError('That user was not found', 400)
    }

    const passwordMatch = await user.checkPassword(request.body.password)

    if (!passwordMatch) {
      throw new ApiError('That password is invalid', 400)
    }

    const token = user.createToken()

    return response.json({ token })
  } catch (error) {
    next(error)
  }
}

export const sendVerificationEmail: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    if (!request.user) {
      throw new ApiError('Please log in', 403)
    }

    const mailSent = await request.user.sendVerificationEmail()

    if (!mailSent) {
      throw new ApiError('The email could not be sent', 500)
    }

    return response.json({ message: 'The verification email has been sent' })
  } catch (error) {
    next(error)
  }
}

export const verifyEmail: RequestHandler = async (request, response, next) => {
  try {
    if (!request.body.token) {
      throw new ApiError('Please provide a verification token', 400)
    }

    const tokenData = jsonwebtoken.verify(request.body.token, server.jwtSecret)

    if (
      typeof tokenData === 'string' ||
      tokenData.action !== 'verifyEmail' ||
      !tokenData._id
    ) {
      throw new ApiError('That token is invalid', 400)
    }

    const user = await User.findOne({
      _id: tokenData._id,
    })

    if (!user) {
      throw new ApiError('That user could not be found', 400)
    }

    await user.markAsVerified()

    return response.json({ message: 'Your email address has been verified' })
  } catch (error) {
    next(error)
  }
}
