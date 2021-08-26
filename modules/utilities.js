const mongoose = require('mongoose')
const User = require('../models/User')

const connectDatabase = () => {
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

const prepareDocument = document => {
  let preparedDocument = document

  switch (document.constructor) {
    case User:
      preparedDocument = preparedDocument.toObject()

      preparedDocument.password = undefined

      break

    default:
      break
  }

  return preparedDocument
}

const prepareDocuments = documents => {
  documents.map(document => utilities.prepareDocument(document))
}

module.exports = {
  connectDatabase,
  prepareDocument,
  prepareDocuments,
}
