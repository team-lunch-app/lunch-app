const config = require('./config')
const app = require('./app')
const http = require('http')
const mongoose = require('mongoose')

const server = http.createServer(app)

mongoose.connect(config.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: config.dbName,
}).then(() => {
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
  })
})
