const jwt = require('jsonwebtoken')
const authorization = require('./authorization')
const config = require('../config')

test('getUserFromRequest returns valid user when auth header exists', async () => {
  const userForToken = {
    id: '5e259460d106bf0c27e931a0',
    username: 'jaskajoku'
  }

  const token = jwt.sign(userForToken, config.jwtSecret)
  const mockGet = jest.fn()
  mockGet.mockReturnValue(`bearer ${token}`)
  const request = { get: mockGet }

  const actual = authorization.getTokenFromRequest(request)
  expect(actual).toMatchObject(userForToken)
})

test('getUserFromRequest returns null when auth header is not present', async () => {
  const request = { get: jest.fn() }
  request.get.mockReturnValue(undefined)

  const actual = authorization.getTokenFromRequest(request)
  expect(actual).toBeNull()
})
