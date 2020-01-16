const MongodbMemoryServer = require('mongodb-memory-server')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Restaurant = require('../models/restaurant')

let mongodb
beforeAll(() => {
  jest.setTimeout(4000)
  mongodb = new MongodbMemoryServer.default({
    instance: {

    },
    binary: {
      version: '3.6.1',
    },
  })
})

let server
beforeEach(async () => {
  global.MONGODB_URI = await mongodb.getConnectionString()
  global.MONGODB_NAME = await mongodb.getDbName()

  const app = require('../app')
  server = supertest(app)

  for (var i = 0; i < 3; i++) {
    const restaurant = new Restaurant({
      name: `Restaurant #${i}`,
      url: 'http://url.com'
    })

    await restaurant.save()
  }
})

afterEach(async () => {
  for (const i in mongoose.connection.collections) {
    mongoose.connection.collections[i].deleteMany(() => {})
  }

  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
})

afterAll(() => {
  mongodb.stop()
  mongoose.connection.close()
})

test('that get request to /api/restaurants returns correct number of restaurants', async () => {
  const response = await server.get('/api/restaurants')
  console.log('aaaa')
  const contents = response.body
  expect(contents.length).toBe(3)
})
