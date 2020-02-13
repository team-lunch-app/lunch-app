const bcrypt = require('bcrypt')
const User = require('../models/user')
const authorization = require('../util/authorization')

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

  const token = authorization.createToken(user._id, user.username)
  response
    .status(200)
    .send({ token })
})

module.exports = authRouter
