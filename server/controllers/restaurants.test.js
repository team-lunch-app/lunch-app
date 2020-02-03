const supertest = require('supertest')
const Restaurant = require('../models/restaurant')
const Category = require('../models/category')
const app = require('../app')

const dbUtil = require('../test/dbUtil')

const restaurantData = [
  {
    name: 'Torigrilli',
    url: 'https://www.torigrilli.fi',
  },
  {
    name: 'Jaskan Pitsa & Kebab Oy',
    url: 'https://www.jaskankebu.fi',
  },
  {
    name: 'Steissin BK',
    url: 'https://www.steissin-bk.fi',
  },
]

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

let server, restaurants, categories
beforeEach(async () => {
  dbUtil.connect()
  server = supertest(app)
  restaurants = await dbUtil.createRowsFrom(Restaurant, restaurantData)
  await dbUtil.createRowsFrom(Category, testCategoryData)
  const dbCategories = await server.get('/api/categories')
  categories = dbCategories.body
})

afterEach(async () => {
  await dbUtil.cleanupAndDisconnect()
})

test('get request to /api/restaurants returns correct number of restaurants', async () => {
  const response = await server.get('/api/restaurants')
  const contents = response.body
  expect(contents.length).toBe(3)
})

test('post request to /api/restaurants fails if no category list is provided', async () => {
  await server
    .post('/api/restaurants')
    .send({ name: 'Ravintola Artjärvi', url: 'N/A', })
    .expect(400)
})

test('post request to /api/restaurants with valid data succeeds', async () => {
  await server
    .post('/api/restaurants')
    .send({ name: 'Ravintola Artjärvi', url: 'N/A', categories: [] })
    .expect(200)
    .expect('Content-Type', /application\/json/i)
})

test('post request to /api/restaurants with valid data gets added restaurant as response', async () => {
  const categoryId = categories[0].id

  const response = await server
    .post('/api/restaurants')
    .send({ name: 'Ravintola Artjärvi', url: 'N/A', categories: [categoryId] })

  const contents = response.body
  expect(contents).toMatchObject({
    name: 'Ravintola Artjärvi',
    url: 'N/A',
    categories: [categoryId]
  })
})

test('post request to /api/restaurants with valid data adds the restaurant to DB', async () => {
  const response = await server
    .post('/api/restaurants')
    .send({ name: 'Ravintola Artjärvi', url: 'N/A' })

  const id = response.body.id
  const restaurant = await Restaurant.findById(id)
  expect(restaurant).toBeDefined()
})

test('post request to /api/restaurants without url succeeds', async () => {
  await server
    .post('/api/restaurants')
    .send({ name: 'Ravintola Artjärvi', categories: [] })
    .expect(200)
    .expect('Content-Type', /application\/json/i)
})

test('post request to /api/restaurants with url containing only whitespace succeeds', async () => {
  await server
    .post('/api/restaurants')
    .send({ name: 'Ravintola Artjärvi', url: '   ', categories: [] })
    .expect(200)
    .expect('Content-Type', /application\/json/i)
})

test('after post request to /api/restaurants with url containing only whitespace, the url is undefined', async () => {
  const response = await server
    .post('/api/restaurants')
    .send({ name: 'Ravintola Artjärvi', url: '   ', categories: [] })

  const id = response.body.id
  const restaurant = await Restaurant.findById(id)
  expect(restaurant.url).not.toBeDefined()
})

test('post request to /api/restaurants with url but without name fails', async () => {
  await server
    .post('/api/restaurants')
    .send({ url: 'http://some-url.com' })
    .expect(400)
})

test('delete request to /api/restaurants/id with proper ID succeeds', async () => {
  const id = restaurants[1]._id

  await server
    .delete(`/api/restaurants/${id}`)
    .expect(200)
})

test('delete request to /api/restaurants/id with proper ID removes the restaurant from DB', async () => {
  const id = restaurants[1]._id

  await server.delete(`/api/restaurants/${id}`)

  const restaurant = await Restaurant.findById(id)
  expect(restaurant).toBeNull()
})

test('delete request to /api/restaurants/id with invalid ID fails', async () => {
  const id = 'invalid'

  await server
    .delete(`/api/restaurants/${id}`)
    .expect(400)
})

test('post request to /api/restaurants with very long name fails', async () => {
  await server
    .post('/api/restaurants')
    .send({ name: 'abc'.repeat(1337) })
    .expect(400)
})

test('post request to /api/restaurants with very long url fails', async () => {
  await server
    .post('/api/restaurants')
    .send({ name: 'Ravintola Artjärvi', url: 'abc'.repeat(4242) })
    .expect(400)
})
