require('dotenv').config()
const path = require('path')

const staticDir = path.join(__dirname, '..', 'build')
const port = process.env.PORT || 3001
const dbUrl = process.env.NODE_ENV === 'test'
  ? global.MONGODB_URI
  : process.env.MONGODB_URI

const dbName = process.env.NODE_ENV === 'test'
  ? global.MONGODB_NAME
  : undefined

const jwtSecret = process.env.NODE_ENV === 'test'
  ? 'sekret'
  : process.env.SECRET

const bcryptSaltRounds = process.env.NODE_ENV === 'test'
  ? 4
  : process.env.SALT_ROUNDS || 10

if (dbUrl === null || dbUrl === undefined) {
  throw new Error('Database URL is not defined! Environment variable MONGODB_URI was empty. Either define it manually or add it to your .env')
}

if (jwtSecret === null || jwtSecret === undefined) {
  throw new Error('JWT Secret is not defined! Environment variable SECRET was empty. Either define it manually or add it to your .env')
}

module.exports = {
  port,
  staticDir,
  dbUrl,
  dbName,
  jwtSecret,
  bcryptSaltRounds,
}
