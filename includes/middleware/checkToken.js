const User = require('../models/User')

const checkToken = async (request, response, next) => {
  try {
    if (!request.headers.authorization) {
      return next()
    }

    const user = await User.verifyToken(request.headers.authorization)

    if (!user) {
      return next()
    }

    request.user = user

    return next()
  } catch (error) {
    return next(error)
  }
}

module.exports = checkToken
