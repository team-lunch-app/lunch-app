const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const { restaurantsRouter } = require('./controllers/restaurants')
const categoriesRouter = require('./controllers/categories')
const authRouter = require('./controllers/auth')
const suggestionRouter = require('./controllers/suggestions')

const config = require('./config')

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] === 'http') {
    res.redirect(302, `https://${req.hostname}${req.originalUrl}`)
  } else {
    return next()
  }
})

app.use(express.static(config.staticDir))
app.use(cors())

app.use(bodyParser.json())
app.use('/api/restaurants', restaurantsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/auth', authRouter)
app.use('/api/suggestions', suggestionRouter)

app.get('/*', (req, res) => {
  res.sendFile(path.join(config.staticDir, 'index.html'))
})

app.use((error, request, response, next) => {
  if (error.name === 'NotAuthorized') {
    return response.status(403).send({ error: error.message })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
})

module.exports = app
