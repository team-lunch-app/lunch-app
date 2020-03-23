const supertest = require('supertest')
const Suggestion = require('../models/suggestion')
const Restaurant = require('../models/restaurant')
const app = require('../app')

const dbUtil = require('../test/dbUtil')
const authorization = require('../util/authorization')

const suggestionData = [
  {
    type: 'ADD',
    data: {
      name: 'Torigrilli',
      url: 'www.url.fi',
      categories: [],
      address: 'Jokukatu 2',
      coordinates: {
        latitude: 25,
        longitude: 61
      },
      distance: 1001
    }
  }
]

const restaurantData = [
  {
    name: 'McDonalds',
    url: 'www.mcd.fi',
    categories: [],
    address: 'Jokukatu 2',
    coordinates: {
      latitude: 26,
      longitude: 59
    },
    distance: 1020
  },
  {
    name: 'Steissin BK',
    url: 'https://www.steissin-bk.fi',
    categories: [],
    address: 'Jokukatu 2',
    coordinates: {
      latitude: 24,
      longitude: 59
    },
    distance: 1020
  },
]

let server, suggestions, user, token, restaurants, removeSuggestions, editSuggestions
const getAdditionalSuggestions = () => [
  {
    name: 'McDonalds',
    url: 'www.mcd.fi',
    categories: [],
    address: 'Jokukatu 3',
    coordinates: {
      latitude: 26,
      longitude: 62
    },
    distance: 1002,
    placeId: 'ChIJLxuNHssLkkYRE4g89GmS8_0'
  }
]

beforeEach(async () => {
  dbUtil.connect()
  server = supertest(app)
  suggestions = await dbUtil.createRowsFrom(Suggestion, suggestionData)
  restaurants = await dbUtil.createRowsFrom(Restaurant, restaurantData)

  const testRemoveSuggestions = [
    {
      type: 'REMOVE',
      data: restaurants[0]
    },
    {
      type: 'REMOVE',
      data: restaurants[0]
    }
  ]

  const testEditSuggestions = [
    {
      type: 'EDIT',
      data: {
        _id: restaurants[0].id,
        name: 'McDonalds Kamppi',
        address: 'Jokukatu 42',
        coordinates: {
          latitude: 62,
          longitude: 15
        },
        distance: 1074
      }
    }
  ]

  removeSuggestions = await dbUtil.createRowsFrom(Suggestion, testRemoveSuggestions)
  editSuggestions = await dbUtil.createRowsFrom(Suggestion, testEditSuggestions)

  user = await dbUtil.createUser('jaskajoku', 'kissa')
  token = authorization.createToken(user._id, user.username)
})

afterEach(async () => {
  await dbUtil.cleanupAndDisconnect()
})

test('creating an ADD suggestion responds with 201', async () => {
  const toBeAdded = getAdditionalSuggestions()[0]
  await server
    .post('/api/suggestions/add')
    .send(toBeAdded)
    .expect(201)
    .expect('Content-Type', /application\/json/i)
})

test('creating an ADD suggestion creates a database entry', async () => {
  const toBeAdded = getAdditionalSuggestions()[0]
  const response = await server
    .post('/api/suggestions/add')
    .send(toBeAdded)

  const suggestion = await Suggestion.findById(response.body.id)
  expect(suggestion.toJSON()).toMatchObject({
    type: 'ADD',
    data: toBeAdded
  })
})

test('creating an EDIT suggestion creates a database entry', async () => {
  const restaurant = restaurants[0]
  const newRestaurant = {
    id: restaurant.id,
    name: 'McDonalds uusi',
    url: 'www.mcduusi.fi',
    categories: [],
    address: 'Jokukatu 42',
    coordinates: {
      latitude: 62,
      longitude: 15
    },
    distance: 1074
  }
  const response = await server
    .post('/api/suggestions/edit')
    .send(newRestaurant)
  const suggestion = await Suggestion.findById(response.body.id)
  expect(suggestion.toJSON()).toMatchObject({
    type: 'EDIT',
    data: {
      id: restaurant.id,
      name: 'McDonalds uusi',
      url: 'www.mcduusi.fi',
      categories: [],
    }
  })
})

test('creating an EDIT suggestion responds with 201', async () => {
  const restaurant = restaurants[0]
  const newRestaurant = {
    id: restaurant.id,
    ...getAdditionalSuggestions()[0]
  }
  await server
    .post('/api/suggestions/edit')
    .send(newRestaurant)
    .expect(201)
    .expect('Content-Type', /application\/json/i)
})

test('creating an EDIT suggestion without restaurant id responds with 400', async () => {
  const newRestaurant = getAdditionalSuggestions()[0]
  await server
    .post('/api/suggestions/edit')
    .send(newRestaurant)
    .expect(400)
})

test('creating an REMOVE suggestion responds with 201', async () => {
  const id = restaurants[0].id
  await server
    .post('/api/suggestions/remove')
    .send({
      id: id,
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

test('approving a REMOVE request with a valid id removes other suggestions related to the restaurant from thedatabase', async () => {
  const suggestions = removeSuggestions
  await server
    .post(`/api/suggestions/approve/${suggestions[0].id}`)
    .set('authorization', `bearer ${token}`)

  const otherSuggestion = await Suggestion.findById(suggestions[1].id)
  expect(otherSuggestion).toBeFalsy()
})

test('approving a request with a valid id removes database entry for suggestion', async () => {
  const suggestion = removeSuggestions[0]
  await server
    .post(`/api/suggestions/approve/${suggestion.id}`)
    .set('authorization', `bearer ${token}`)

  const approvedSuggestion = await Suggestion.findById(suggestion.id)
  expect(approvedSuggestion).toBeFalsy()
})

test('approving an EDIT request with a valid id responds with status 200', async () => {
  const suggestion = editSuggestions[0]
  await server
    .post(`/api/suggestions/approve/${suggestion.id}`)
    .set('authorization', `bearer ${token}`)
    .expect(200)
})

test('approving an EDIT request with a valid id updates the database entry for restaurant', async () => {
  const suggestion = editSuggestions[0]
  await server
    .post(`/api/suggestions/approve/${suggestion.id}`)
    .set('authorization', `bearer ${token}`)

  const restaurant = await Restaurant.findById(suggestion.data.id)

  const expected = { ...suggestion.data.toJSON() }

  delete expected.id
  expect(restaurant.toJSON()).toMatchObject(expected)
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

describe('when not logged in', () => {
  test('trying to approve request fails with 401', async () => {
    await server
      .post(`/api/suggestions/approve/${suggestions[0].id}`)
      .expect(401)
  })

  test('trying to reject request fails with 401', async () => {
    await server
      .post(`/api/suggestions/reject/${suggestions[0].id}`)
      .expect(401)
  })

  test('trying to getAll fails with 401', async () => {
    await server
      .get('/api/suggestions/')
      .expect(401)
  })
})

test('get request to /api/suggestions returns correct number of suggestions', async () => {
  const response = await server.get('/api/suggestions').set('authorization', `bearer ${token}`)
  const contents = response.body
  expect(contents.length).toBe(4)
})
