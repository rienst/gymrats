const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const ApiError = require('../classes/ApiError')

const schema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

schema.pre('save', async function (next) {
  if (this.email.search('@') === -1) {
    throw new ApiError('Please provide a valid email', 400)
  }

  if (this.password.length < 8) {
    throw new ApiError(
      'Please provide a password of at least 8 characters',
      400
    )
  }

  this.password = await bcrypt.hash(this.password, 10)

  next()
})

const model = mongoose.model('User', schema)

module.exports = model
