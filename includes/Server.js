const express = require('express')
const cors = require('cors')
const authRouter = require('./routes/api/auth')
const usersRouter = require('./routes/api/users')
const checkToken = require('./middleware/checkToken')
const handleNotFound = require('./middleware/handleNotFound')
const handleError = require('./middleware/handleError')

class Server {
  constructor(port = 5000) {
    this.port = port
  }

  start() {
    const server = express()

    server.use(cors())
    server.use(express.urlencoded({ extended: false }))
    server.use(express.json())
    server.use(checkToken)

    server.use('/api/auth', authRouter)
    server.use('/api/users', usersRouter)

    server.use(handleNotFound)
    server.use(handleError)

    server.listen(this.port, () =>
      console.log(`The server is now listening on port ${this.port}`)
    )

    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('The server has been terminated')
      })
    })
  }
}

module.exports = Server
