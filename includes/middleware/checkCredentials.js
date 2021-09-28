const User = require('../models/User')

const checkCredentials = async (request, response, next) => {
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

module.exports = checkCredentials
