const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

const model = mongoose.model('Exercise', schema)

module.exports = model
