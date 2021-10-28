import dotenv from 'dotenv'
import Database from './abstracts/Database'
import Server from './abstracts/Server'
import Mailer from './abstracts/Mailer'

dotenv.config()

const server = new Server()
export const database = new Database()
export const mailer = new Mailer()

database.connect()

process.on('SIGINT', () => server.close(process.exit))
process.on('SIGTERM', () => server.close(process.exit))

export default server
