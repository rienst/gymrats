const express = require('express')
const ApiError = require('./ApiError')
const apiRouter = require('../api')

class Server {
  constructor(port = 5000) {
    const server = express()

    server.use(express.urlencoded({ extended: false }))
    server.use(express.json())

    server.use('/api', apiRouter)

    server.use(this.handleNotFound)

    server.use(this.handleError)

    server.listen(port, () =>
      console.log(`The server is now listening on port ${port}`)
    )

    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('The server has been terminated')
      })
    })
  }

  handleNotFound(request, response, next) {
    return next(new ApiError('That route does not exist', 404))
  }

  handleError(error, request, response, next) {
    console.log(error)

    const errorDetails = {
      status: 500,
      message: 'Something went wrong',
    }

    if (error.name === 'ApiError') {
      errorDetails.status = error.status
      errorDetails.message = error.message
    }

    if (error.name === 'ValidationError') {
      errorDetails.status = 400
      errorDetails.message = error._message
    }

    if (error.code && error.code == 11000) {
      errorDetails.status = 409
      errorDetails.message = 'A user with that email address already exists'
    }

    response.status(errorDetails.status)
    response.json({
      error: {
        message: errorDetails.message,
      },
    })
  }
}

module.exports = Server
