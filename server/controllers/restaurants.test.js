const supertest = require('supertest')
const mongoose = require('mongoose')
const Restaurant = require('../models/restaurant')

const createRestaurant = async (name, url) => {
  const restaurant = new Restaurant({ name, url })

  return await restaurant.save()
}

let server
beforeEach(async () => {
  const app = require('../app')
  server = supertest(app)

  const maybeAdded = []
  for (var i = 0; i < 3; i++) {
    maybeAdded.push(createRestaurant(
      `Restaurant #${i}`,
      `http://url-${i}.com`,
    ))
  }

  await Promise.all(maybeAdded)
})

afterEach(async () => {
  for (const i in mongoose.connection.collections) {
    mongoose.connection.collections[i].deleteMany(() => { })
  }

  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
})

afterAll(() => {
  mongoose.connection.close()
})

test('that get request to /api/restaurants returns correct number of restaurants', async () => {
  const response = await server.get('/api/restaurants')
  const contents = response.body
  expect(contents.length).toBe(3)
})
