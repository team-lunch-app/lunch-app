const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const restaurantsRouter = require('./controllers/restaurants')

const config = require('./config')

app.use(express.static(config.staticDir))
app.use(cors())

app.use(bodyParser.json())
app.use('/api/restaurants', restaurantsRouter)

app.get('/', (req, res) => {
  res.sendFile(path.join(config.staticDir, 'index.html'))
})

module.exports = app