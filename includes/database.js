const mongoose = require('mongoose')

class Database {
  constructor(url) {
    try {
      mongoose.connect(url, {
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
}

module.exports = Database
