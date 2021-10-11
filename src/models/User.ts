import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import nodemailer from 'nodemailer'

export interface User {
  email: string
  password?: string
  name?: string
  isAdmin: boolean
  isVerified: boolean
}

export interface UserDocument extends User, mongoose.Document {
  createToken: () => string
  sendVerificationEmail: () => Promise<true>
  wasNew?: boolean
}

export interface UserModel extends mongoose.Model<UserDocument> {
  checkCredentials: (email: string, password: string) => Promise<User>
  checkToken: (token: string) => Promise<User>
  verifyEmail: (token: string) => Promise<User>
}

const userSchema = new mongoose.Schema<UserDocument, UserModel>({
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
  isVerified: {
    type: Boolean,
    default: false,
  },
})

userSchema.statics.checkCredentials = async function (
  email: string,
  password: string
) {
  const user = await this.findOne({ email }).select('+password')

  if (!user || !user.password) {
    throw new Error('That user was not found')
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    throw new Error('That password is invalid')
  }

  return user
}

userSchema.statics.checkToken = async function (token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error('The token could not be validated')
  }

  const tokenData = jsonwebtoken.verify(token, process.env.JWT_SECRET)

  if (typeof tokenData === 'string' || !tokenData._id) {
    throw new Error('That token is invalid')
  }

  const user = await this.findOne({ _id: tokenData._id })

  if (!user) {
    throw new Error('That user was not found')
  }

  return user
}

userSchema.statics.verifyEmail = async function (token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error('The email could not be validated')
  }

  const tokenData = jsonwebtoken.verify(token, process.env.JWT_SECRET)

  if (
    typeof tokenData === 'string' ||
    tokenData.action !== 'verifyEmail' ||
    !tokenData._id
  ) {
    throw new Error('That password is invalid')
  }

  const user = await this.findOne({ _id: tokenData._id })

  if (!user) {
    throw new Error('The email could not be validated')
  }

  user.isVerified = true

  await user.save()

  return user
}

userSchema.methods.createToken = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error('The token could not be created')
  }

  const token = jsonwebtoken.sign({ _id: this._id }, process.env.JWT_SECRET)

  return token
}

userSchema.methods.sendVerificationEmail = async function () {
  if (!process.env.JWT_SECRET) {
    throw new Error('The verification email could not be sent')
  }

  const verificationToken = await jsonwebtoken.sign(
    {
      _id: this._id,
      action: 'verifyEmail',
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  )

  const verificationLink = `${process.env.URL}/verify-email?token=${verificationToken}`

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  })

  const mailInfo = await transporter.sendMail({
    from: `Gymrats <${process.env.MAIL_USER}>`,
    to: 'rien@rsdigitalstrategy.com',
    subject: 'Please confirm your password',
    text: `Thank you for signing up to Gymrats!\n\nPlease confirm your email address using the following link:\n\n${verificationLink}`,
    html: `<p>Thank you for signing up to Gymrats!</p><p>Please confirm your email address using <a href="${verificationLink}">this link</a>.</p><p><a href="${verificationLink}">${verificationLink}</a></p>`,
  })

  if (!mailInfo) {
    throw new Error('The email could not be sent')
  }

  return true
}

userSchema.pre<UserDocument>('save', async function (next) {
  this.wasNew = this.isNew

  if (this.password && this.isModified('password')) {
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
