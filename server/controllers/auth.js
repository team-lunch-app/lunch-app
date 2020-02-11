const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const config = require('../config')

const authRouter = require('express').Router()

authRouter.post('/login', async (request, response) => {
  const body = request.body
  const username = body.username
  const password = body.password

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

  if (!(user && passwordCorrect)) {
    return response.status(403).json({
      error: 'invalid username or password'
    })
  }
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, config.jwtSecret)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = authRouter
