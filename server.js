const dotenv = require('dotenv').config()
const Database = require('./includes/Database')
const Server = require('./includes/Server')

const database = new Database(process.env.MONGODB_URL)
database.connect()

const server = new Server(process.env.PORT)
server.start()
