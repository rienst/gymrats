import dotenv from 'dotenv'
import Database from './abstracts/Database'
import Server from './abstracts/Server'
import Mailer from './abstracts/Mailer'

dotenv.config()

const server = new Server()
export const database = new Database()
export const mailer = new Mailer()

database.connect()

const closeServer = () => {
  server.close(process.exit)
}

process.on('uncaughtException', closeServer)
process.on('SIGINT', closeServer)
process.on('SIGTERM', closeServer)
process.on('SIGUSR2', closeServer)

export default server
