import mongoose from 'mongoose'

export default class Database {
  url: string

  constructor(url: string) {
    this.url = url
  }

  async connect() {
    if (!process.env.MONGODB_URL) {
      throw new Error('Could not establish a database connection')
    }

    await mongoose.connect(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
  }
}
