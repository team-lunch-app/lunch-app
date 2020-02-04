const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const restaurantsRouter = require('./controllers/restaurants')
const categoriesRouter = require('./controllers/categories')

const config = require('./config')

app.use(express.static(config.staticDir))
app.use(cors())

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] != 'https') {
    res.redirect(302, `https://${req.hostname}${req.originalUrl}`)
  } else {
    return next()
  }
})

app.use(bodyParser.json())
app.use('/api/restaurants', restaurantsRouter)
app.use('/api/categories', categoriesRouter)

app.get('/*', (req, res) => {
  res.sendFile(path.join(config.staticDir, 'index.html'))
})

module.exports = app
