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

module.exports = {
  port,
  staticDir,
  dbUrl,
  dbName
}
