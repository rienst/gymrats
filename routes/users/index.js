const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../../models/User')
const utilities = require('../../modules/utilities')
const ApiError = require('../../classes/ApiError')

const router = express.Router()

router.get('/', async (request, response, next) => {
  try {
    const users = await User.find()

    if (!users || !users.length) throw new ApiError('No users were found', 404)

    response.json(users)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (request, response, next) => {
  try {
    if (!request.body.email) {
      throw new ApiError('No email address was provided', 400)
    }

    if (!request.body.password) {
      throw new ApiError('No password was provided', 400)
    }

    const password = await bcrypt.hash(request.body.password, 10)

    const user = new User({
      email: request.body.email,
      password,
      name: request.body.name,
    })

    const savedUser = await user.save()
    const savedUserObject = utilities.prepareDocument(savedUser)

    response.json(savedUserObject)
  } catch (error) {
    if (error.code === 11000) {
      next(new ApiError('That email address is already taken', 400))
    }

    next(error)
  }
})

module.exports = router
