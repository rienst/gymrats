const express = require('express')
const bcrypt = require('bcrypt')
const ApiError = require('../../classes/ApiError')
const User = require('../../models/User')

const router = express.Router()

router.get('/:_id', async (request, response, next) => {
  try {
    const user = await User.findOne()

    if (!user) throw new ApiError('That user could not be found', 404)

    response.json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/:_id', async (request, response, next) => {
  try {
    let changes = {}

    if (request.body.email) {
      changes.email = request.body.email
    }

    if (request.body.password) {
      changes.password = await bcrypt.hash(request.body.password, 10)
    }

    if (request.body.name) {
      changes.name = request.body.name
    }

    const savedUser = await User.findOneAndUpdate(
      { _id: request.params._id },
      changes,
      { new: true }
    )

    response.json(savedUser)
  } catch (error) {
    next(error)
  }
})

router.delete('/:_id', async (request, response, next) => {
  try {
    const result = await User.deleteOne({ _id: request.params._id })

    if (result.deletedCount === 0) {
      throw new ApiError('That user could not be deleted, it might not exist')
    }

    response.send('The user was successfully deleted')
  } catch (error) {
    next(error)
  }
})

module.exports = router
