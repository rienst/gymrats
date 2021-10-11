import { RequestHandler } from 'express'
import ApiError from '../abstracts/ApiError'
import User from '../models/User'

export default class UserController {
  static post: RequestHandler = async (request, response) => {
    if (request.body.isAdmin === true) {
      throw new ApiError('Administrators cannot be created', 400)
    }

    const user = new User(request.body)

    const savedUser = await user.save()

    const token = savedUser.createToken()

    return response.json({ token })
  }

  static getSingle: RequestHandler = async (request, response) => {
    const user = await User.findById(request.params._id)

    if (!user) {
      throw new ApiError('That user could not be found', 404)
    }

    return response.json({ user })
  }

  static patchSingle: RequestHandler = async (request, response) => {
    if (!request.user) {
      throw new ApiError('You need to be logged in to update users', 401)
    }

    if (!request.user.isAdmin) {
      if (request.params._id !== request.user._id.toString()) {
        throw new ApiError(
          'You need administrator rights to update other users',
          403
        )
      }

      if (request.body.isAdmin === true) {
        throw new ApiError('You cannot make yourself an administrator', 403)
      }
    }

    const user = await User.findById(request.params._id)

    if (!user) {
      throw new ApiError('Could not modify user', 400)
    }

    const savedUser = await user.set(request.body).save()

    return response.json({ user: savedUser })
  }

  static deleteSingle: RequestHandler = async (request, response) => {
    if (!request.user) {
      throw new ApiError('You need to be logged in to delete users', 401)
    }

    if (
      !request.user.isAdmin &&
      request.params._id !== request.user._id.toString()
    ) {
      throw new ApiError(
        'You need administrator rights to delete other users',
        401
      )
    }

    const result = await User.deleteOne({ _id: request.params._id })

    if (result.deletedCount === 0) {
      response.status(404)
      throw new ApiError(
        'That user could not be deleted, it probably does not exist',
        404
      )
    }

    return response.json({ message: 'The user was successfully deleted' })
  }
}
