import { ErrorRequestHandler } from 'express'
import { Error } from 'mongoose'
import { ValidationErrors } from '../types'

const handleError: ErrorRequestHandler = (error, request, response) => {
  console.error(error)

  // Handle duplicate key error
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

  response.status(500)
  return response.json({ error: 'Something went wrong' })
}

export default handleError
