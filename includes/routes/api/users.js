const express = require('express')
const User = require('../../models/User')

const router = express.Router()

router.get('/', async (request, response, next) => {
  try {
    let query = {}

    if (request.body.name) {
      query = {
        ...query,
        name: {
          $regex: request.body.name,
          $options: 'i',
        },
      }
    }

    if (request.body.email) {
      query = {
        ...query,
        email: {
          $regex: request.body.email,
          $options: 'i',
        },
      }
    }

    if (request.body.isAdmin) {
      query = {
        ...query,
        isAdmin: request.body.isAdmin,
      }
    }

    let orderBy = 'email'
    let order = 'asc'

    if (request.body.orderBy) {
      orderBy = request.body.orderBy
    }

    if (request.body.order === 'desc') {
      order = request.body.order
    }

    const users = await User.find(query).sort({ [orderBy]: order })

    return response.json({ users })
  } catch (error) {
    return next(error)
  }
})

router.get('/:_id', async (request, response, next) => {
  try {
    const user = await User.findById(request.params._id)

    if (!user) {
      response.status(404)
      return response.json({ error: 'That user could not be found' })
    }

    return response.json({ user })
  } catch (error) {
    return next(error)
  }
})

router.post('/', async (request, response, next) => {
  try {
    if (request.body.isAdmin === true) {
      response.status(400)
      return response.json({ error: 'Administrators cannot be created' })
    }

    const user = new User(request.body)

    const savedUser = await user.save()

    const token = savedUser.createToken()

    return response.json({ token })
  } catch (error) {
    return next(error)
  }
})

router.patch('/:_id', async (request, response, next) => {
  try {
    if (!request.user) {
      response.status(401)
      return response.json({
        error: 'You need to be logged in to update users',
      })
    }

    if (!request.user.isAdmin) {
      if (request.params._id !== request.user._id.toString()) {
        response.status(403)
        return response.json({
          error: 'You need administrator rights to update other users',
        })
      }

      if (request.body.isAdmin === true) {
        response.status(403)
        return response.json({
          error: 'You cannot make yourself an administrator',
        })
      }
    }

    const user = await User.findById(request.params._id)

    await user.set(request.body)

    const savedUser = await user.save()

    return response.json({ user: savedUser })
  } catch (error) {
    return next(error)
  }
})

router.delete('/:_id', async (request, response, next) => {
  try {
    if (!request.user) {
      response.status(401)
      return response.json({
        error: 'You need to be logged in to delete users',
      })
    }

    if (
      !request.user.isAdmin &&
      request.params._id !== request.user._id.toString()
    ) {
      response.status(401)
      return response.json({
        error: 'You need administrator rights to delete other users',
      })
    }

    const result = await User.deleteOne({ _id: request.params._id })

    if (result.deletedCount === 0) {
      response.status(404)
      return response.json({
        error: 'That user could not be deleted, it probably does not exist',
      })
    }

    return response.json({ message: 'The user was successfully deleted' })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
