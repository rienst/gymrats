const express = require('express')
const checkCredentials = require('../../middleware/checkCredentials')

const router = express.Router()

router.get('/', async (request, response, next) => {
  try {
    if (!request.user) {
      response.status(403)
      return response.json({ error: 'Could not log in' })
    }

    response.json({ user: request.user })
  } catch (error) {
    return next(error)
  }
})

router.post('/', checkCredentials, async (request, response, next) => {
  try {
    const token = request.user.createToken()

    response.json({ token })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
