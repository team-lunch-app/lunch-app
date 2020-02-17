const supertest = require('supertest')
const Category = require('../models/category')
const app = require('../app')
const authorization = require('../util/authorization')
const features = require('../../util/features')

const dbUtil = require('../test/dbUtil')

const testCategoryData = [
  {
    name: 'Krapula',
  },
  {
    name: 'Salad',
  },
  {
    name: 'Burger',
  }
]

let server, user, token
beforeEach(async () => {
  dbUtil.connect()
  server = supertest(app)
  await dbUtil.createRowsFrom(Category, testCategoryData)
  user = await dbUtil.createUser('jaskajoku', 'kissa')
  token = authorization.createToken(user._id, user.username)
})

afterEach(async () => {
  await dbUtil.cleanupAndDisconnect()
})

test('get returns a list of categories', async () => {
  const response = await server.get('/api/categories')
  const contents = response.body
  expect(contents.length).toBe(3)
})

test('post request with valid data returns http code 200', async () => {
  await server
    .post('/api/categories')
    .set('authorization', `bearer ${token}`)
    .send({ name: 'Italian', restaurants: [] })
    .expect(200)
})

test('post request with empty string as name returns http code 400', async () => {
  await server
    .post('/api/categories')
    .set('authorization', `bearer ${token}`)
    .send({ name: '                   ' })
    .expect(400)
})

test('getById gets the correct category', async () => {
  let response = await server.get('/api/categories')
  const contents = response.body
  const category = contents[0]
  response =   await server
    .get('/api/categories/'+category.id)
    .set('authorization', `bearer ${token}`)
  expect(response.body.name).toBe(category.name)
})

test('getById with a faulty id gets nothing', async () => {
  let response = await server.get('/api/categories')
  const contents = response.body
  const category = contents[0]
  response =   await server
    .get('/api/categories/'+category.id+555)
    .set('authorization', `bearer ${token}`)
    .expect(400)
})

features.describeIf(features.endpointAuth, 'when not logged in', () => {
  test('post request with valid data and invalid token returns http code 403', async () => {
    await server
      .post('/api/categories')
      .send({ name: 'Italian', restaurants: [] })
      .expect(403)
  })

  test('getById only allows authorized requests', async () => {
    let response = await server.get('/api/categories')
    const contents = response.body
    const category = contents[0]
    response =   await server
      .get('/api/categories/'+category.id)
      .expect(403)
  })

  test('delete only allows authorized requests', async () => {
    let response = await server.get('/api/categories')
    const contents = response.body
    const category = contents[0]
    response =   await server
      .delete('/api/categories/'+category.id)
      .expect(403)
  })
})
