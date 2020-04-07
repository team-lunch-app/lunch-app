const supertest = require('supertest')
const app = require('../app')
const authorization = require('../util/authorization')
const Statistics = require('../models/statistics')
const Restaurant = require('../models/restaurant')
const Category = require('../models/category')
const dbUtil = require('../test/dbUtil')

const statisticsData = [
  {
    lotteryAmount: 1000,
    notSelectedAmount: 300,
    selectedAmount: 100,
    notDecidedAmount: 600
  }
]
const restaurantData = [
  {
    name: 'Torigrilli',
    url: 'https://www.torigrilli.fi',
    categories: [],
    address: 'Jokukatu 1',
    coordinates: {
      latitude: 24,
      longitude: 60
    },
    distance: 300,
    notSelectedAmount: 80,
    resultAmount: 99
  },
  {
    name: 'Jaskan Pitsa & Kebab Oy',
    url: 'https://www.jaskankebu.fi',
    address: 'Jokukatu 2',
    coordinates: {
      latitude: 25,
      longitude: 61
    },
    distance: 500,
    notSelectedAmount: 1,
    resultAmount: 102
  },
  {
    name: 'Steissin BK',
    url: 'https://www.steissin-bk.fi',
    address: 'Jokukatu 3',
    coordinates: {
      latitude: 26,
      longitude: 62
    },
    distance: 700,
    notSelectedAmount: 50,
    resultAmount: 101
  },
  {
    name: 'Steissin mäkki',
    url: 'https://www.steissin-mäkki.fi',
    address: 'Jokukatu 4',
    coordinates: {
      latitude: 29,
      longitude: 92
    },
    distance: 707,
    notSelectedAmount: 80,
    resultAmount: 90
  },
]

const getAdditionalCategories = (res1, res2, res3,) => [
  {
    name: 'smallCat',
    restaurants: [res1, res2]
  },
  {
    name: 'bigCat',
    restaurants: [res2, res3, res1]
  },
  {
    name: 'smallestCat',
    restaurants: [res3]
  },
]

beforeEach(async () => {
  dbUtil.connect()
  server = supertest(app)
  statistics = await dbUtil.createRowsFrom(Statistics, statisticsData)
  restaurants = await dbUtil.createRowsFrom(Restaurant, restaurantData)
  id = statistics[0].id
  user = await dbUtil.createUser('jaskajoku', 'kissa')
  token = authorization.createToken(user._id, user.username)
})

afterEach(async () => {
  await dbUtil.cleanupAndDisconnect()
})

test('get request to /api/statistics/topAccepted returns the right restaurants in the right order', async () => {
  const response = await server.get('/api/statistics/topAccepted')
  const contents = response.body
  expect(contents[0].name).toBe(restaurants[1].name)
  expect(contents[1].name).toBe(restaurants[2].name)
  expect(contents[2].name).toBe(restaurants[0].name)
  expect(contents[3].name).toBe(restaurants[3].name)
})

test('get request to /api/statistics/topResult returns the right restaurants in the right order', async () => {
  const response = await server.get('/api/statistics/topResult')
  const contents = response.body
  expect(contents[0].name).toBe(restaurants[1].name)
  expect(contents[1].name).toBe(restaurants[2].name)
  expect(contents[2].name).toBe(restaurants[0].name)
  expect(contents[3].name).toBe(restaurants[3].name)
})

test('get request to /api/statistics/biggestCategories returns the right categories in the right order', async () => {
  await dbUtil.createRowsFrom(Category, getAdditionalCategories(restaurants[0].id, restaurants[1].id, restaurants[2].id))
  const response = await server.get('/api/statistics/biggestCategories')
  const contents = response.body

  expect(contents[0].restaurants.length).toBe(3)
  expect(contents[1].restaurants.length).toBe(2)
  expect(contents[2].restaurants.length).toBe(1)
})

test('get request to /api/statistics/topCategories returns the right categories in the right order', async () => {
  await dbUtil.createRowsFrom(Category, getAdditionalCategories(restaurants[1].id, restaurants[2].id, restaurants[0].id))
  const response = await server.get('/api/statistics/topCategories')
  const contents = response.body
  expect(contents[0].name).toBe("bigCat")
  expect(contents[1].name).toBe("smallCat")
  expect(contents[2].name).toBe("smallestCat")
})

test('get request to /api/statistics returns statistics', async () => {
  const response = await server.get('/api/statistics')
  const contents = response.body
  expect(contents.length).toBe(1)
})

test('put request to /api/lotteryAmount/:id increases lotteryAmount', async () => {
  const expectedAmount = statistics[0].lotteryAmount + 1
  await server
    .put(`/api/statistics/lotteryAmount/${id}`)
    .expect(200)
  const response = await server.get('/api/statistics')
  expect(response.body[0].lotteryAmount).toBe(expectedAmount)
})

test('put request to /api/selectedAmount/:id increases selectedAmount', async () => {
  const expectedAmount = statistics[0].selectedAmount + 1
  await server
    .put(`/api/statistics/selectedAmount/${id}`)
    .expect(200)
  const response = await server.get('/api/statistics')
  expect(response.body[0].selectedAmount).toBe(expectedAmount)
})

test('put request to /api/notSelectedAmount/:id increases notSelectedAmount', async () => {
  const expectedAmount = statistics[0].notSelectedAmount + 1
  await server
    .put(`/api/statistics/notSelectedAmount/${id}`)
    .expect(200)
  const response = await server.get('/api/statistics')
  expect(response.body[0].notSelectedAmount).toBe(expectedAmount)
})

test('put request to /api/notDecidedAmount/:id increases notDecidedAmount', async () => {
  const expectedAmount = statistics[0].notDecidedAmount + 1
  await server
    .put(`/api/statistics/notDecidedAmount/${id}`)
    .expect(200)
  const response = await server.get('/api/statistics')
  expect(response.body[0].notDecidedAmount).toBe(expectedAmount)
})