const { response } = require('express')
const express = require('express')
const jsonwebtoken = require('jsonwebtoken')
const ApiError = require('../../classes/ApiError')
const User = require('../../models/User')

const router = express.Router()

router.get('/', async (request, response, next) => {
  try {
    const authorizationHeader = request.headers.authorization

    if (authorizationHeader.slice(0, 6) !== 'Bearer') {
      throw new ApiError('No valid bearer token found', 400)
    }

    const token = authorizationHeader.slice(7)

    const tokenData = jsonwebtoken.verify(token, process.env.JWT_SECRET)

    if (!tokenData._id) throw new ApiError('That token is invalid', 400)

    const user = await User.findOne({ _id: tokenData._id })

    response.send(user)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (request, response, next) => {
  try {
    const user = await User.findOne({ _id: request.body._id })

    if (!user) throw new ApiError('That user could not be found', 404)

    const token = jsonwebtoken.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    response.json({ token })
  } catch (error) {
    next(error)
  }
})

module.exports = router
