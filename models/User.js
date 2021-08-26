const mongoose = require('mongoose')

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
})

const model = mongoose.model('User', schema)

module.exports = model
