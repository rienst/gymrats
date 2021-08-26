const express = require('express')
const authRouter = require('./auth')
const usersRouter = require('./users')
const singleUserRouter = require('./users/single')

const router = express.Router()

router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/users', singleUserRouter)

module.exports = router
