const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: [true, 'That email address is already taken'],
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
    minLength: [8, 'Please provide a password of at least 8 characters'],
  },
  name: {
    type: String,
    minLength: [3, 'Please provide a name of at least 3 characters'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

userSchema.pre('findOneAndUpdate', async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10)
  }

  if (this.name) {
    this.name = validator.escape(this.name)
  }

  console.log(this.name)

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
