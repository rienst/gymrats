import dotenv from 'dotenv'
import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import authRouter from './routes/api/auth'
import usersRouter from './routes/api/users'
import checkToken from './middleware/checkToken'
import handleNotFound from './middleware/handleNotFound'
import handleError from './middleware/handleError'

dotenv.config()

if (!process.env.MONGODB_URL) {
  process.exit()
}

const mongoDbUrl: string = process.env.MONGODB_URL
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 5000

mongoose.connect(mongoDbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

const server: express.Application = express()
server.use(cors())
server.use(express.urlencoded({ extended: false }))
server.use(express.json())
server.use(checkToken)
server.use('/api/auth', authRouter)
server.use('/api/users', usersRouter)
server.use(handleNotFound)
server.use(handleError)
server.listen(port, () =>
  console.log(`The server is now listening on port ${port}`)
)
