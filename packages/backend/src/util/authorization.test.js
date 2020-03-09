const authorization = require('./authorization')
const dbUtil = require('../test/dbUtil')

let user, token, expiredUser, expiredUserToken
beforeEach(async () => {
  jest.clearAllMocks()
  dbUtil.connect()
  user = await dbUtil.createUser('admintestuser', 'kissakoira123')
  token = authorization.createToken(user._id, user.username)

  expiredUser = await dbUtil.createUser('expireduser', 'aaabbb')
  expiredUser.passwordExpired = true
  await expiredUser.save()
  expiredUserToken = authorization.createToken(expiredUser._id, expiredUser.username)
})

afterEach(async () => {
  await dbUtil.cleanupAndDisconnect()
})

test('getUserFromRequest returns valid user when auth header exists', async () => {
  const mockGet = jest.fn()
  mockGet.mockReturnValue(`bearer ${token}`)
  const request = { get: mockGet }

  const actual = authorization.getTokenFromRequest(request)
  expect(actual).toMatchObject({
    username: user.username,
    id: user.id,
  })
})

test('getUserFromRequest returns null when auth header is not present', async () => {
  const request = { get: jest.fn() }
  request.get.mockReturnValue(undefined)

  const actual = authorization.getTokenFromRequest(request)
  expect(actual).toBeNull()
})

test('requireAuthorized throws NotAuthorized when token is invalid', async () => {
  const request = { get: jest.fn() }
  request.get.mockReturnValue('an invalid token')

  await expect(authorization.requireAuthorized(request)).rejects.toThrowError(authorization.NotAuthorizedError)
})

test('requireAuthorized throws NotAuthorized when token is not present', async () => {
  const request = { get: jest.fn() }
  request.get.mockReturnValue(undefined)

  await expect(authorization.requireAuthorized(request)).rejects.toThrowError(authorization.NotAuthorizedError)
})

test('requireAuthorized returns user info when token is valid', async () => {
  const mockGet = jest.fn()
  mockGet.mockReturnValue(`bearer ${token}`)
  const request = { get: mockGet }

  const userInfo = await authorization.requireAuthorized(request)
  expect(userInfo).toBeDefined()
  expect(userInfo.id).toBe(user.id)
  expect(userInfo.username).toBe(user.username)
})

test('requireAuthorized fails with 403 if password has expired', async () => {
  const mockGet = jest.fn()
  mockGet.mockReturnValue(`bearer ${expiredUserToken}`)
  const request = { get: mockGet }

  await expect(authorization.requireAuthorized(request)).rejects.toThrowError(authorization.NotAuthorizedError)
})

test('requireAuthorized succeeds if password has expired but override flag is provided', async () => {
  const mockGet = jest.fn()
  mockGet.mockReturnValue(`bearer ${expiredUserToken}`)
  const request = { get: mockGet }

  await expect(authorization.requireAuthorized(request, { acceptExpiredPassword: true })).resolves.toBeDefined()
})
