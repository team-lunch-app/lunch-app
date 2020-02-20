const supertest = require('supertest')
const Suggestion = require('../models/suggestion')
const Restaurant = require('../models/restaurant')
const app = require('../app')

const dbUtil = require('../test/dbUtil')
const authorization = require('../util/authorization')
const features = require('../../util/features')

const suggestionData = [
  {
    type: 'ADD',
    data: {
      name: 'Torigrilli',
      url: 'www.url.fi',
      categories: [],
    }
  }
]

const restaurantData = [
  {
    name: 'McDonalds',
    url: 'www.mcd.fi',
    categories: [],
  },
  {
    name: 'Steissin BK',
    url: 'https://www.steissin-bk.fi',
  },
]

let server, suggestions, user, token, restaurants, removeSuggestions

beforeEach(async () => {
  dbUtil.connect()
  server = supertest(app)
  suggestions = await dbUtil.createRowsFrom(Suggestion, suggestionData)
  restaurants = await dbUtil.createRowsFrom(Restaurant, restaurantData)

  const testRemoveSuggestion = {
    type: 'REMOVE',
    data: restaurants[0]
  }

  removeSuggestions = await dbUtil.createRowsFrom(Suggestion, [testRemoveSuggestion])

  user = await dbUtil.createUser('jaskajoku', 'kissa')
  token = authorization.createToken(user._id, user.username)
})

afterEach(async () => {
  await dbUtil.cleanupAndDisconnect()
})

test('creating an ADD suggestion responds with 201', async () => {
  await server
    .post('/api/suggestions/add')
    .send({
      name: 'McDonalds',
      url: 'www.mcd.fi',
      categories: [],
    })
    .expect(201)
    .expect('Content-Type', /application\/json/i)
})

test('creating an ADD suggestion creates a database entry', async () => {
  const response = await server
    .post('/api/suggestions/add')
    .send({
      name: 'McDonalds',
      url: 'www.mcd.fi',
      categories: [],
    })

  const suggestion = await Suggestion.findById(response.body.id)
  expect(suggestion.toJSON()).toMatchObject({
    type: 'ADD',
    data: {
      name: 'McDonalds',
      url: 'www.mcd.fi',
      categories: [],
    }
  })
})

test('creating an REMOVE suggestion responds with 201', async () => {
  const id = restaurants[0].id
  await server
    .post('/api/suggestions/remove')
    .send({
      id: id,
      name: 'McDonalds',
      url: 'www.mcd.fi',
      categories: [],

    })
    .expect(201)
    .expect('Content-Type', /application\/json/i)
})

test('creating an REMOVE suggestion creates a database entry', async () => {
  const id = restaurants[0].id
  const response = await server
    .post('/api/suggestions/remove')
    .send({
      id: id,
      name: 'McDonalds',
      url: 'www.mcd.fi',
      categories: [],
    })

  const suggestion = await Suggestion.findById(response.body.id)
  expect(suggestion.toJSON()).toMatchObject({
    type: 'REMOVE',
    data: {
      name: 'McDonalds',
      url: 'www.mcd.fi',
      categories: [],
    }
  })
})

test('creating an REMOVE suggestion without an id fails with status 400', async () => {
  await server
    .post('/api/suggestions/remove')
    .send({
      name: 'McDonalds',
      url: 'www.mcd.fi',
      categories: [],
    })
    .expect(400)
})

test('approving an ADD request with a valid id returns with status 201', async () => {
  const suggestion = suggestions[0]
  await server
    .post(`/api/suggestions/approve/${suggestion.id}`)
    .set('authorization', `bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/i)
})

test('approving an ADD request with a valid id creates a database entry for restaurant', async () => {
  const suggestion = suggestions[0]
  const response = await server
    .post(`/api/suggestions/approve/${suggestion.id}`)
    .set('authorization', `bearer ${token}`)

  const restaurant = await Restaurant.findById(response.body.id)

  const expected = { ...suggestion.data.toJSON() }
  delete expected.id
  expect(restaurant.toJSON()).toMatchObject(expected)
})

test('attempting to approve a request with an INVALID id returns with 404', async () => {
  await server
    .post('/api/suggestions/approve/5e4a5c7f6c345836481fc09b')
    .set('authorization', `bearer ${token}`)
    .expect(404)
})

test('approving a REMOVE request with a valid id returns with status 204', async () => {
  const suggestion = removeSuggestions[0]
  await server
    .post(`/api/suggestions/approve/${suggestion.id}`)
    .set('authorization', `bearer ${token}`)
    .expect(204)
})

test('approving a REMOVE request with a valid id removes database entry for restaurant', async () => {
  const suggestion = removeSuggestions[0]
  await server
    .post(`/api/suggestions/approve/${suggestion.id}`)
    .set('authorization', `bearer ${token}`)

  const restaurant = await Restaurant.findById(suggestion.data.id)
  expect(restaurant).toBeFalsy()
})

test('approving a request with a valid id removes database entry for suggestion', async () => {
  const suggestion = removeSuggestions[0]
  await server
    .post(`/api/suggestions/approve/${suggestion.id}`)
    .set('authorization', `bearer ${token}`)

  const approvedSuggestion = await Suggestion.findById(suggestion.id)
  expect(approvedSuggestion).toBeFalsy()
})

test('attempting to reject a request with an INVALID id returns with 404', async () => {
  await server
    .post('/api/suggestions/reject/5e4a5c7f6c345836481fc09b')
    .set('authorization', `bearer ${token}`)
    .expect(404)
})

test('rejecting a request with a valid id removes database entry for suggestion', async () => {
  const suggestion = removeSuggestions[0]
  await server
    .post(`/api/suggestions/reject/${suggestion.id}`)
    .set('authorization', `bearer ${token}`)

  const removedSuggestion = await Suggestion.findById(suggestion.id)
  expect(removedSuggestion).toBeFalsy()
})

test('attempting to reject a request with a VALID id returns with 204', async () => {
  const suggestion = removeSuggestions[0]
  await server
    .post(`/api/suggestions/reject/${suggestion.id}`)
    .set('authorization', `bearer ${token}`)
    .expect(204)
})

features.describeIf(features.endpointAuth, 'when not logged in', () => {
  test('trying to approve request fails with 403', async () => {
    await server
      .post(`/api/suggestions/approve/${suggestions[0].id}`)
      .expect(403)
  })

  test('trying to reject request fails with 403', async () => {
    await server
      .post(`/api/suggestions/reject/${suggestions[0].id}`)
      .expect(403)
  })

  test('trying to getAll fails with 403', async () => {
    await server
      .get('/api/suggestions/')
      .expect(403)
  })
})

test('get request to /api/suggestions returns correct number of suggestions', async () => {
  const response = await server.get('/api/suggestions').set('authorization', `bearer ${token}`)
  const contents = response.body
  expect(contents.length).toBe(2)
})
