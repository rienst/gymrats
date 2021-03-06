import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import server, { mailer } from '../server'

export interface User {
  email: string
  name?: string
  isAdmin: boolean
  isVerified: boolean
}

export interface UserDocument extends User, mongoose.Document {
  checkPassword: (password: string) => Promise<boolean>
  createToken: () => string
  sendVerificationEmail: () => Promise<boolean>
  markAsVerified: () => Promise<true>
  getClientObject: () => User
  wasNew?: boolean
  password: string
}

interface UserModel extends mongoose.Model<UserDocument> {
  sendResetPasswordEmail: (email: string) => Promise<boolean>
}

const userSchema: mongoose.Schema<UserDocument> = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: [true, 'That email address is already taken'],
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
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
  isVerified: {
    type: Boolean,
    default: false,
  },
})

userSchema.methods.checkPassword = async function (password: string) {
  const passwordMatches = await bcrypt.compare(password, this.password)

  return passwordMatches
}

userSchema.methods.createToken = function () {
  const token = jsonwebtoken.sign({ _id: this._id }, server.jwtSecret)

  return token
}

userSchema.methods.sendVerificationEmail = async function () {
  const verificationToken = jsonwebtoken.sign(
    {
      _id: this._id,
      action: 'verifyEmail',
    },
    server.jwtSecret,
    {
      expiresIn: '7d',
    }
  )

  const verificationLink = `${server.url}/verify-email?token=${verificationToken}`

  const mailSent = await mailer.sendMail({
    to: this.email,
    subject: 'Please confirm your password',
    text: `Hi!\n\nThank you for signing up to Gymrats! Please confirm your email address by clicking on the link below:\n\n${verificationLink}\n\nHappy lifting!\n\nThe Gymrats team`,
  })

  return mailSent
}

userSchema.statics.sendResetPasswordEmail = async function (email: string) {
  const verificationToken = jsonwebtoken.sign(
    {
      email,
      action: 'resetPassword',
    },
    server.jwtSecret,
    {
      expiresIn: '7d',
    }
  )

  const passwordResetLink = `${server.url}/reset-password?token=${verificationToken}`

  const mailSent = await mailer.sendMail({
    to: email,
    subject: 'Resetting your password',
    text: `Hi,\n\nWe have received a request to reset the password for your Gymrats account. To do this, use the following link:\n\n${passwordResetLink}\n\nIf you didn't request a password reset, you can ignore this email.\n\nThanks,\n\nThe Gymrats team`,
  })

  return mailSent
}

userSchema.methods.markAsVerified = async function () {
  this.isVerified = true

  await this.save()

  return true
}

userSchema.methods.getClientObject = function () {
  const userMinusPassword = this.set('password', undefined)
  const clientObject: User = userMinusPassword.toObject()

  return clientObject
}

userSchema.pre<UserDocument>('save', async function (next) {
  this.wasNew = this.isNew

  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }

  if (this.name && this.isModified('name')) {
    this.name = validator.escape(this.name)
  }

  next()
})

userSchema.post<UserDocument>('save', async function () {
  if (!this.wasNew) {
    return
  }

  this.sendVerificationEmail()
})

export default mongoose.model<UserDocument, UserModel>('User', userSchema)
