import dotenv from 'dotenv'
import Database from './abstracts/Database'
import Server from './abstracts/Server'

dotenv.config()

if (!process.env.MONGODB_URL) {
  throw new Error('Please provide a MongoDB url')
}

const database = new Database(process.env.MONGODB_URL)
const server = new Server(process.env.PORT ? parseInt(process.env.PORT) : 5000)

database.connect()
server.launch()
