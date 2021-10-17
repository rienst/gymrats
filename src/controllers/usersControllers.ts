import { RequestHandler } from 'express'
import ApiError from '../abstracts/ApiError'
import User from '../models/User'

export const getUser: RequestHandler = async (request, response, next) => {
  try {
    const user = await User.findById(request.params._id)

    if (!user) {
      throw new ApiError('That user could not be found', 404)
    }

    const userClientObject = user.getClientObject()

    return response.json({ user: userClientObject })
  } catch (error) {
    next(error)
  }
}

export const insertUser: RequestHandler = async (request, response, next) => {
  try {
    if (request.body.isAdmin === true) {
      throw new ApiError('Administrators cannot be created', 400)
    }

    const user = new User(request.body)

    const savedUser = await user.save()

    const token = savedUser.createToken()

    return response.json({ token })
  } catch (error) {
    next(error)
  }
}

export const patchUser: RequestHandler = async (request, response, next) => {
  try {
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

    const savedUserClientObject = savedUser.getClientObject()

    return response.json({ user: savedUserClientObject })
  } catch (error) {
    next(error)
  }
}

export const deleteUser: RequestHandler = async (request, response, next) => {
  try {
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
  } catch (error) {
    next(error)
  }
}
