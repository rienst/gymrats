import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import nodemailer from 'nodemailer'

export type User = {
  _id: string
  email: string
  name?: string
  isAdmin: boolean
  isVerified: boolean
  __v: number
}

const userSchema = new mongoose.Schema<User>({
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

userSchema.statics.verifyEmail = async token => {
  const tokenData = jsonwebtoken.verify(token, process.env.JWT_SECRET)

  if (tokenData.action !== 'verifyEmail' || !tokenData._id) {
    return false
  }

  const user = await User.findOne({ _id: tokenData._id })

  if (!user) {
    return false
  }

  user.isVerified = true

  await user.save()

  return true
}

userSchema.methods.createToken = function () {
  const token = jsonwebtoken.sign({ _id: this._id }, process.env.JWT_SECRET)

  return token
}

userSchema.methods.sendVerificationEmail = async function () {
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
}

userSchema.pre('save', async function (next) {
  this.wasNew = this.isNew

  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }

  if (this.isModified('name')) {
    this.name = validator.escape(this.name)
  }

  next()
})

userSchema.post('save', async function (doc) {
  try {
    if (!this.wasNew) {
      return
    }

    this.sendVerificationEmail()
  } catch (error) {}
})

const UserModel = mongoose.model<User>('User', userSchema)

export default UserModel
