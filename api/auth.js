const express = require('express')
const jsonwebtoken = require('jsonwebtoken')
const authMiddleware = require('../includes/middleware/auth')

const router = express.Router()

router.get('/', authMiddleware.verifyToken, async (request, response, next) => {
  try {
    response.send(request.user)
  } catch (error) {
    return next(error)
  }
})

router.post(
  '/',
  authMiddleware.verifyCredentials,
  async (request, response, next) => {
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
  }
)

module.exports = router
