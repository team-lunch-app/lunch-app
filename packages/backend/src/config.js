require('dotenv').config()
const path = require('path')

const staticDir = path.join(__dirname, '../../app/build')
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

const googleApiKey = process.env.NODE_ENV === 'test'
  ? 'gapikey'
  : process.env.GOOGLE_API_KEY

const bcryptSaltRounds = process.env.NODE_ENV === 'test'
  ? 4
  : process.env.SALT_ROUNDS || 10

const originLatitude = 60.170000
const originLongitude = 24.941944

if (dbUrl === null || dbUrl === undefined) {
  throw new Error('Database URL is not defined! Environment variable MONGODB_URI was empty. Either define it manually or add it to your .env')
}

if (jwtSecret === null || jwtSecret === undefined) {
  throw new Error('JWT Secret is not defined! Environment variable SECRET was empty. Either define it manually or add it to your .env')
}

if (googleApiKey === null || googleApiKey === undefined) {
  throw new Error('Google API Key is not defined! Environment variable GOOGLE_API_KEY was empty. Either define it manually or add it to your .env')
}

module.exports = {
  port,
  staticDir,
  dbUrl,
  dbName,
  jwtSecret,
  bcryptSaltRounds,
  googleApiKey,
  originLatitude,
  originLongitude
}
