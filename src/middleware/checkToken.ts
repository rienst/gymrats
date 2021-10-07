import User from '../models/User'

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

export default checkToken
