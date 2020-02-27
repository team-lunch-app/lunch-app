const supertest = require('supertest')
const Category = require('../models/category')
const app = require('../app')
const authorization = require('../util/authorization')

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

test('post request with valid data returns http code 201', async () => {
  await server
    .post('/api/categories')
    .set('authorization', `bearer ${token}`)
    .send({ name: 'Italian', restaurants: [] })
    .expect(201)
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

test('getById with a malformatted id gets nothing', async () => {
  let response = await server.get('/api/categories')
  const contents = response.body
  const category = contents[0]
  await server
    .get('/api/categories/'+category.id+55)
    .set('authorization', `bearer ${token}`)
    .expect(400)
})

test('delete removes the correct category', async () => {
  let response = await server.get('/api/categories')
  const contents = response.body
  const category = contents[0]
  response =   await server
    .delete('/api/categories/'+category.id)
    .set('authorization', `bearer ${token}`)
  expect(response.status).toBe(204)
  await server
    .get('/api/categories/'+category.id)
    .set('authorization', `bearer ${token}`)
    .expect(404)
})

describe('when not logged in', () => {
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
