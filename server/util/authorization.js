const jwt = require('jsonwebtoken')
const config = require('../config')

const getTokenFromHeaders = (request) => {
  const authorization = request.get('authorization')
  return (authorization && authorization.toLowerCase().startsWith('bearer '))
    ? authorization.substring(7)
    : null
}

const getTokenFromRequest = (request) => {
  const token = getTokenFromHeaders(request)
  return token
    ? jwt.verify(token, config.jwtSecret)
    : null
}

const requireAuthorized = (request) => {
  const token = getTokenFromRequest(request)
  if (!token) {
    const error = new Error('Not authorized')
    error.name = 'NotAuthorized'
    throw error
  }
}

module.exports = {
  getTokenFromRequest,
  requireAuthorized
}
