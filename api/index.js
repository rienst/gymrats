const express = require('express')
const authRouter = require('./auth')
const usersRouter = require('./users')
const exercisesRouter = require('./exercises')

const router = express.Router()

router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/exercises', exercisesRouter)

module.exports = router
