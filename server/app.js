const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const restaurantsRouter = require('./controllers/restaurants')

const config = require('./config')

mongoose.connect(config.dbUrl, {
  useNewUrlParser: true,
  dbName: config.dbName
}).then(() => {
  console.log('Connected to mongo.')
})

app.use(express.static(config.staticDir))
app.use(cors())

app.use(bodyParser.json())
app.use('/api/restaurants', restaurantsRouter)

app.get('/', (req, res) => {
  res.sendFile(path.join(config.staticDir, 'index.html'))
})

module.exports = app