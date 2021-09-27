const mongoose = require('mongoose')

class Database {
  constructor(url) {
    this.url = url
  }

  connect() {
    try {
      mongoose.connect(this.url, {
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
