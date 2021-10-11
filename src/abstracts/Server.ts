import express from 'express'
import cors from 'cors'
import authRouter from '../routes/authRoute'
import UsersController from '../controllers/UsersController'
import checkToken from '../middleware/checkToken'
import handleNotFound from '../middleware/handleNotFound'
import handleError from '../middleware/handleError'

export default class Server {
  port: number = 5000
  instance: express.Application

  constructor(port: number) {
    this.port = port
    this.instance = express()
  }

  launch() {
    this.instance.use(cors())
    this.instance.use(express.urlencoded({ extended: false }))
    this.instance.use(express.json())
    this.instance.use(checkToken)
    this.instance.use('/api/auth', authRouter)
    this.instance.use('/api/users', new UsersController().router)
    this.instance.use(handleNotFound)
    this.instance.use(handleError)
    this.instance.listen(this.port, () =>
      console.log(`The server is now listening on port ${this.port}`)
    )
  }
}
