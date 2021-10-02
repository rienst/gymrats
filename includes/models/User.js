const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

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

userSchema.statics.verifyCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return false
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return false
  }

  return user
}

userSchema.statics.verifyToken = async token => {
  try {
    const tokenData = jsonwebtoken.verify(token, process.env.JWT_SECRET)

    if (!tokenData._id) {
      return false
    }

    const user = await User.findOne({ _id: tokenData._id })

    if (!user) {
      return false
    }

    return user
  } catch (error) {
    return false
  }
}

userSchema.methods.createToken = function () {
  const token = jsonwebtoken.sign({ _id: this._id }, process.env.JWT_SECRET)

  return token
}

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }

  if (this.isModified('name')) {
    this.name = validator.escape(this.name)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
