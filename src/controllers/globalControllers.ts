import { ErrorRequestHandler, RequestHandler } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import { Error } from 'mongoose'
import { ValidationErrors } from '../types'
import server from '../server'
import ApiError from '../abstracts/ApiError'
import User from '../models/User'

export const setRequestUserIfInToken: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    if (!request.headers.authorization) {
      return next()
    }

    const tokenData = jsonwebtoken.verify(
      request.headers.authorization,
      server.jwtSecret
    )

    if (typeof tokenData === 'string' || !tokenData._id) {
      return next()
    }

    const user = await User.findOne({
      _id: tokenData._id,
    })

    if (!user) {
      return next()
    }

    request.user = user

    return next()
  } catch (error) {
    return next(error)
  }
}

export const throwRouteNotFoundError: RequestHandler = (
  request,
  response,
  next
) => {
  next(new ApiError('That route does not exist', 404))
}

export const logError: ErrorRequestHandler = (
  error,
  request,
  response,
  next
) => {
  console.error(error)

  return next(error)
}

export const sendClientError: ErrorRequestHandler = (
  error,
  request,
  response,
  next
) => {
  try {
    // Handle duplicate key errors
    if (error.code && error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]

      response.status(409)
      return response.json({ error: `That ${field} is already taken` })
    }

    if (error.name === 'ValidationError') {
      const mongooseValidationError: Error.ValidationError = error
      const validationErrors: ValidationErrors = {}

      Object.values(mongooseValidationError.errors).forEach(
        mongooseValidationError => {
          if (mongooseValidationError.name === 'ValidationError') {
            return
          }

          validationErrors[mongooseValidationError.path] =
            mongooseValidationError.message
        }
      )

      response.status(400)
      return response.json({
        error: 'There were some issues with your submission',
        validationErrors,
      })
    }

    if (error.name === 'ApiError') {
      const apiError: ApiError = error

      response.status(apiError.statusCode)
      return response.json({
        error: apiError.message,
      })
    }

    response.status(500)
    return response.json({ error: 'Something went wrong' })
  } catch (error) {
    response.status(500)
    return response.json({ error: 'Something went wrong' })
  }
}
