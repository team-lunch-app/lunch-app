const jwt = require('jsonwebtoken')
const config = require('../config')
const User = require('../models/user')

class NotAuthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotAuthorized'
  }
}

class PasswordExpired extends Error {
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
  try {
    const user = await User.findById(token.id)
    const expired = user.passwordExpired || false
    if (expired && !allowExpired) {
      throw new PasswordExpired('Password has expired')
    }
  } catch (error) {
    throw new NotAuthorizedError('Not authorized')
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
  NotAuthorizedError
}
