const express = require('express')
const ApiError = require('../includes/classes/ApiError')
const Exercise = require('../includes/models/Exercise')
const authMiddleware = require('../includes/middleware/auth')

const router = express.Router()

router.get('/', authMiddleware.verifyToken, async (request, response, next) => {
  try {
    const exercises = await Exercise.find().populate('createdBy')

    if (!exercises || !exercises.length) {
      throw new ApiError('No exercises were found', 404)
    }

    response.json(exercises)
  } catch (error) {
    return next(error)
  }
})

router.post(
  '/',
  authMiddleware.verifyToken,
  async (request, response, next) => {
    try {
      if (!request.body.name) {
        throw new ApiError('No name was provided', 400)
      }

      if (request.body.isDefault && !request.user.isAdmin) {
        throw new ApiError(
          'You need administrator rights to create default exercises',
          401
        )
      }

      const exercise = new Exercise({
        name: request.body.name,
        createdBy: request.user._id,
        isDefault: request.body.isDefault,
      })

      const savedExercise = await exercise.save()

      response.json(savedExercise)
    } catch (error) {
      return next(error)
    }
  }
)

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
      let changes = {}

      if (request.body.name) {
        changes.name = request.body.name
      }

      const savedExercise = await User.findOneAndUpdate(
        { _id: request.params._id },
        changes,
        { new: true }
      )

      response.json(savedExercise)
    } catch (error) {
      return next(error)
    }
  }
)

router.delete(
  '/:_id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  async (request, response, next) => {
    try {
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
