const supertest = require('supertest')
const Category = require('../models/category')
const app = require('../app')

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

let server
beforeEach(async () => {
  dbUtil.connect()
  server = supertest(app)
  await dbUtil.createRowsFrom(Category, testCategoryData)
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
    .send({ name: 'Italian', restaurants: [] })
    .expect(200)
})

test('post request with empty string as name returns http code 400', async () => {
  await server
    .post('/api/categories')
    .send({ name: '                   ' })
    .expect(400)
})
