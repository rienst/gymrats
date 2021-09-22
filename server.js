const dotenv = require('dotenv')
const Database = require('./includes/Database')
const Server = require('./includes/Server')

dotenv.config()

const database = new Database(process.env.MONGODB_URL)
const server = new Server(process.env.PORT)
