const supertest = require('supertest')
const mongoose = require('mongoose')
const Restaurant = require('../models/restaurant')
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

let server, restaurants
beforeEach(async () => {
  dbUtil.connect()
  server = supertest(app)
  restaurants = await dbUtil.createRowsFrom(Restaurant, restaurantData)
})

afterEach(async () => {
  await dbUtil.cleanupAndDisconnect()
})

test('get request to /api/restaurants returns correct number of restaurants', async () => {
  const response = await server.get('/api/restaurants')
  const contents = response.body
  expect(contents.length).toBe(3)
})

test('post request to /api/restaurants with valid data succeeds', async () => {
  await server
    .post('/api/restaurants')
    .send({ name: 'Ravintola Artjärvi', url: 'N/A' })
    .expect(200)
    .expect('Content-Type', /application\/json/i)
})

/*test('post request to /api/restaurants with valid data gets added restaurant as response', async () => {
  const response = await server
    .post('/api/restaurants')
    .send({ name: 'Ravintola Artjärvi', url: 'N/A' })

  const contents = response.body
  expect(contents).toMatchObject({
    name: 'Ravintola Artjärvi',
    url: 'N/A',
  })
})

test('post request to /api/restaurants with valid data adds the restaurant to DB', async () => {

})

test('post request to /api/restaurants without url succeeds', async () => {

})

test('post request to /api/restaurants without name fails', async () => {

})*/

