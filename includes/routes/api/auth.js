const express = require('express')
const jsonwebtoken = require('jsonwebtoken')
const checkCredentials = require('../../middleware/checkCredentials')

const router = express.Router()

router.get('/', async (request, response, next) => {
  try {
    response.send(request.user)
  } catch (error) {
    return next(error)
  }
})

router.post('/', checkCredentials, async (request, response, next) => {
  try {
    const token = jsonwebtoken.sign(
      { _id: request.user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    response.json({ token })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
