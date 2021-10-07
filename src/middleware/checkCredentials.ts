import express from 'express'
import User from '../models/User'

const checkCredentials = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!request.body.email) {
      response.status(400)
      return response.json({ error: 'Please provide an email' })
    }

    if (!request.body.password) {
      response.status(400)
      return response.json({ error: 'Please provide a password' })
    }

    const user = await User.verifyCredentials(
      request.body.email,
      request.body.password
    )

    if (!user) {
      response.status(404)
      return response.json({
        error: 'That user could not be found or the password is incorrect',
      })
    }

    request.user = user

    next()
  } catch (error) {
    return next(error)
  }
}

export default checkCredentials
