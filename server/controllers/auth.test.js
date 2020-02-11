const supertest = require('supertest')
const app = require('../app')
const dbUtil = require('../test/dbUtil')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config')


const userData = [
  {
    username: 'jaskajoku',
    password: 'kissa',
  }
]

let server, users
beforeEach(async () => {
  dbUtil.connect()
  server = supertest(app)

  const processedUsers = []
  for (const user of userData) {
    processedUsers.push(await dbUtil.createUser(user.username, user.password))
  }

  users = await dbUtil.createRowsFrom(User, processedUsers)
})

afterEach(async () => {
  await dbUtil.cleanupAndDisconnect()
})

test('post request to login with valid data returns http code 200', async () => {
  await server
    .post('/api/auth/login')
    .send({ username: 'jaskajoku', password: 'kissa' })
    .expect(200)
})

test('post request to login with valid data returns a token', async () => {
  const { body } = await server
    .post('/api/auth/login')
    .send({ username: 'jaskajoku', password: 'kissa' })

  expect(body.token).toBeDefined()
})

test('token returned from login request contains valid user info', async () => {
  const { body } = await server
    .post('/api/auth/login')
    .send({ username: 'jaskajoku', password: 'kissa' })
  const decodedToken = jwt.verify(body.token, config.jwtSecret)
  const id = users[0].id

  expect(decodedToken).toMatchObject({
    username: 'jaskajoku',
    id
  })
})

test('post request to login with invalid data returns http code 403', async () => {
  await server
    .post('/api/auth/login')
    .send({ username: '', password: 'koira' })
    .expect(403)
})
