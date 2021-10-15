import mongoose from 'mongoose'

export default class Database {
  url: string

  constructor() {
    if (!process.env.MONGODB_URL) {
      throw new Error(
        'Not all required environment variables were found to initialize the database'
      )
    }

    this.url = process.env.MONGODB_URL
  }

  async connect() {
    await mongoose.connect(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
  }
}
