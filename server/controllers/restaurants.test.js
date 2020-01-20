const supertest = require('supertest')
const mongoose = require('mongoose')
const Restaurant = require('../models/restaurant')

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

let server
beforeEach(async () => {
  server = supertest(require('../app'))
  await dbUtil.createRowsFrom(Restaurant, restaurantData)
})

afterEach(async () => {
  await dbUtil.cleanupAndDisconnect()
})

test('that get request to /api/restaurants returns correct number of restaurants', async () => {
  const response = await server.get('/api/restaurants')
  const contents = response.body
  expect(contents.length).toBe(3)
})
