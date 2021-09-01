const dotenv = require('dotenv')
const express = require('express')
const database = require('./includes/database')
const apiRouter = require('./api')
const ApiError = require('./includes/classes/ApiError')

dotenv.config()
database.connect()

const server = express()
const port = process.env.PORT || 5000

server.use(express.urlencoded({ extended: false }))
server.use(express.json())

server.use('/api', apiRouter)

server.use((request, response, next) => {
  return next(new ApiError('That route does not exist', 404))
})

server.use((error, request, response, next) => {
  console.error(error.toString())

  const message =
    error instanceof ApiError ? error.message : 'Something went wrong'

  response.status(error.status || 500)
  response.send(message)
})

server.listen(port, () =>
  console.log(`The server is now listening on port ${port}`)
)

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('The server has been terminated')
  })
})
