const express = require('express')
const ApiError = require('../includes/ApiError')
const User = require('../includes/models/User')
const authMiddleware = require('../includes/middleware/auth')

const router = express.Router()

router.get('/', async (request, response, next) => {
  try {
    const users = await User.find()

    if (!users || !users.length) {
      throw new ApiError('No users were found', 404)
    }

    response.json(users)
  } catch (error) {
    return next(error)
  }
})

router.post('/', async (request, response, next) => {
  try {
    if (request.body.isAdmin === true) {
      throw new ApiError(
        "You can't create administrators, you can only promote existing users",
        400
      )
    }

    const user = new User(request.body)

    const savedUser = await user.save()

    savedUser.set('password', undefined)

    response.json(savedUser)
  } catch (error) {
    return next(error)
  }
})

router.get('/:_id', async (request, response, next) => {
  try {
    const user = await User.findOne()

    if (!user) throw new ApiError('That user could not be found', 404)

    response.json(user)
  } catch (error) {
    return next(error)
  }
})

router.put(
  '/:_id',
  authMiddleware.verifyToken,
  async (request, response, next) => {
    try {
      if (!request.user.isAdmin) {
        if (request.params._id !== request.user._id.toString()) {
          throw new ApiError(
            'You need administrator rights to update other users',
            401
          )
        }

        if (request.body.isAdmin === true) {
          throw new ApiError("You can't make yourself an administrator", 401)
        }
      }

      const savedUser = await User.findOneAndUpdate(
        { _id: request.params._id },
        request.body,
        { new: true }
      )

      response.json(savedUser)
    } catch (error) {
      return next(error)
    }
  }
)

router.delete(
  '/:_id',
  authMiddleware.verifyToken,
  async (request, response, next) => {
    try {
      if (
        request.params._id !== request.user._id.toString() &&
        !request.user.isAdmin
      ) {
        throw new ApiError(
          'You need administrator rights to delete other users',
          401
        )
      }

      const result = await User.deleteOne({ _id: request.params._id })

      if (result.deletedCount === 0) {
        throw new ApiError('That user could not be deleted, it might not exist')
      }

      response.send('The user was successfully deleted')
    } catch (error) {
      return next(error)
    }
  }
)

module.exports = router
