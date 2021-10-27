import * as http from 'http'
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
  instance: http.Server
  url: string
  port: number = 5000
  jwtSecret: string

  constructor() {
    if (!process.env.URL || !process.env.JWT_SECRET) {
      throw new Error(
        'Not all required environment variables were found to initialize the server'
      )
    }

    this.url = process.env.URL
    this.port = process.env.PORT ? parseInt(process.env.PORT) : 5000
    this.jwtSecret = process.env.JWT_SECRET

    const application = express()

    application.use(cors())
    application.use(express.urlencoded({ extended: false }))
    application.use(express.json())
    application.use(setRequestUserIfInToken)
    application.use('/api/auth', authRouter)
    application.use('/api/users', usersRouter)
    application.use(throwRouteNotFoundError)
    application.use(logError)
    application.use(sendClientError)

    this.instance = application.listen(this.port, () =>
      console.log(`Server started on port ${this.port}`)
    )
  }

  close(callback: () => any) {
    this.instance.close(() => {
      console.log(`Server closed on port ${this.port}`)

      callback()
    })
  }
}
