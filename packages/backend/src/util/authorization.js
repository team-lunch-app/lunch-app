const jwt = require('jsonwebtoken')
const config = require('../config')

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

const requireAuthorized = (request) => {
  const token = getTokenFromRequest(request)
  if (!token) {
    const error = new Error('Not authorized')
    error.name = 'NotAuthorized'
    throw error
  }
}

const createToken = (id, username) => {
  return jwt.sign({ id, username }, config.jwtSecret)
}

module.exports = {
  getTokenFromRequest,
  requireAuthorized,
  createToken
}
