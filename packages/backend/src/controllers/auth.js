const bcrypt = require('bcrypt')
const User = require('../models/user')
const authorization = require('../util/authorization')
const config = require('../config')

const authRouter = require('express').Router()

const isValidPassword = (password) => {
  return password !== undefined && password.length >= 8
}

// login
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

  const passwordExpired = user.passwordExpired || false
  const token = authorization.createToken(user._id, user.username)
  return response
    .status(200)
    .send({ token, passwordExpired, userId: user._id })
})

// get all users
authRouter.get('/users', async (request, response, next) => {
  try {
    await authorization.requireAuthorized(request)

    const usersWithoutPasswords = await User.find({})
    response.json(usersWithoutPasswords.map(rest => rest.toJSON()))
  } catch (error) {
    next(error)
  }
})

// register
authRouter.post('/users', async (request, response, next) => {
  try {
    await authorization.requireAuthorized(request)
    const body = request.body
    const username = body.username
    const password = body.password

    if (!isValidPassword(password)) {
      return response.status(400).send({ error: 'password too short' })
    }

    const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds)
    const user = await new User({
      username: username,
      password: passwordHash,
      passwordExpired: true,
    }).save()

    return response.status(201).send(user.toJSON())
  } catch (error) {
    next(error)
  }
})

// change user password
authRouter.post('/users/password', async (request, response, next) => {
  try {
    const token = await authorization.requireAuthorized(request, { acceptExpiredPassword: true })

    const body = request.body
    const password = body.password
    const newPassword = body.newPassword

    if (!isValidPassword(newPassword)) {
      return response.status(400).send({ error: 'password too short' })
    }
    if(password === newPassword){
      return response.status(400).send({ error: 'new password cannot be your old password!' })
    }

    const user = await User.findById(token.id)
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.password)

    if (!passwordCorrect) {
      return response.status(403).send({ error: 'wrong or invalid old password' })
    }

    const passwordHash = await bcrypt.hash(newPassword, config.bcryptSaltRounds)
    user.password = passwordHash
    user.passwordExpired = false
    await user.save()

    return response.status(200).end()
  } catch (error) {
    next(error)
  }
})

module.exports = authRouter
