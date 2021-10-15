import express from 'express'
import cors from 'cors'
import authRouter from '../routers/authRouter'
import usersRouter from '../routers/usersRouter'
import { setRequestUserIfInToken } from '../controllers/globalControllers'
import {
  throwRouteNotFoundError,
  logError,
  sendClientError,
} from '../controllers/globalControllers'

export default class Server {
  instance: express.Application
  url: string
  port: number = 5000
  jwtSecret: string

  constructor() {
    if (!process.env.URL || !process.env.JWT_SECRET) {
      throw new Error(
        'Not all required environment variables were found to initialize the server'
      )
    }

    this.instance = express()
    this.url = process.env.URL
    this.port = process.env.PORT ? parseInt(process.env.PORT) : 5000
    this.jwtSecret = process.env.JWT_SECRET
  }

  launch() {
    this.instance.use(cors())
    this.instance.use(express.urlencoded({ extended: false }))
    this.instance.use(express.json())
    this.instance.use(setRequestUserIfInToken)
    this.instance.use('/api/auth', authRouter)
    this.instance.use('/api/users', usersRouter)
    this.instance.use(throwRouteNotFoundError)
    this.instance.use(logError)
    this.instance.use(sendClientError)
    this.instance.listen(this.port)
  }
}
