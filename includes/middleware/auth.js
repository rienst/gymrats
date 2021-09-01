const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ApiError = require('../classes/ApiError')
const User = require('../models/User')

const verifyCredentials = async (request, response, next) => {
  try {
    if (!request.body.email) {
      throw new ApiError('Please provide an email', 400)
    }

    if (!request.body.password) {
      throw new ApiError('Please provide a password', 400)
    }

    const user = await User.findOne({ email: request.body.email }).select(
      '+password'
    )

    if (!user) {
      throw new ApiError('That user could not be found', 404)
    }

    const passwordMatch = await bcrypt.compare(
      request.body.password,
      user.password
    )

    if (!passwordMatch) {
      throw new ApiError('That password is not correct', 400)
    }

    request.user = user

    next()
  } catch (error) {
    return next(error)
  }
}

const verifyToken = async (request, response, next) => {
  try {
    const authorizationHeader = request.headers.authorization

    if (!authorizationHeader) {
      throw new ApiError('No authorization header was found', 400)
    }

    if (authorizationHeader.slice(0, 7) !== 'Bearer ') {
      throw new ApiError('No valid bearer token was found', 400)
    }

    const token = authorizationHeader.slice(7)

    const tokenData = jsonwebtoken.verify(token, process.env.JWT_SECRET)

    if (!tokenData._id) throw new ApiError('That token is invalid', 400)

    const user = await User.findOne({ _id: tokenData._id })

    if (!user) {
      throw new ApiError('That token is invalid', 404)
    }

    request.user = user

    return next()
  } catch (error) {
    if (error instanceof jsonwebtoken.TokenExpiredError) {
      return next(new ApiError('That token has expired', 400))
    }

    return next(error)
  }
}

const verifyAdmin = async (request, response, next) => {
  try {
    if (!request.user) {
      throw new ApiError("Couldn't find a valid user in the request", 400)
    }

    if (request.user.isAdmin !== true) {
      throw new ApiError('You are not an administrator', 400)
    }

    next()
  } catch (error) {
    return next(error)
  }
}

const authMiddleware = {
  verifyCredentials,
  verifyToken,
  verifyAdmin,
}

module.exports = authMiddleware
