const jwt = require('jsonwebtoken')
const config = require('../config')
const User = require('../models/user')

class NotAuthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotAuthorized'
  }
}

class PasswordExpiredError extends Error {
  constructor() {
    super()
    this.name = 'PasswordExpired'
  }
}

const getTokenFromHeaders = (request) => {
  const authorization = request.get('authorization')
  return (authorization && authorization.toLowerCase().startsWith('bearer '))
    ? authorization.substring(7)
    : null
}

const getTokenFromRequest = (request) => {
  try {
    const token = getTokenFromHeaders(request)
    return jwt.verify(token, config.jwtSecret)
  } catch (_) {
    return null
  }
}

const requireAuthorized = async (request, params) => {
  const token = getTokenFromRequest(request)
  const allowExpired = params
    ? params.acceptExpiredPassword
    : false

  if (!token) {
    throw new NotAuthorizedError('Not authorized')
  }

  let expired = false
  try {
    const user = await User.findById(token.id)
    expired = user.passwordExpired
  } catch (error) {
    throw new NotAuthorizedError('Not authorized')
  }

  if (expired && !allowExpired) {
    throw new PasswordExpiredError('Password has expired')
  }

  return token
}

const createToken = (id, username) => {
  return jwt.sign({ id, username }, config.jwtSecret)
}

module.exports = {
  getTokenFromRequest,
  requireAuthorized,
  createToken,
  NotAuthorizedError,
  PasswordExpiredError
}
