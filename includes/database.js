const mongoose = require('mongoose')

const connect = () => {
  try {
    mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })

    console.log('Connected to the database')
  } catch (error) {
    console.error(error)

    process.exit()
  }
}

const database = {
  connect,
}

module.exports = database
