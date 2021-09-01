const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
})

const model = mongoose.model('Exercise', schema)

module.exports = model
