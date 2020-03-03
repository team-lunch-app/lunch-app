const supertest = require('supertest')
const Restaurant = require('../models/restaurant')
const Category = require('../models/category')
const Suggestion = require('../models/suggestion')
const app = require('../app')
const authorization = require('../util/authorization')

const dbUtil = require('../test/dbUtil')

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
    distance: 1000
  },
  {
    name: 'Jaskan Pitsa & Kebab Oy',
    url: 'https://www.jaskankebu.fi',
    address: 'Jokukatu 2',
    coordinates: {
      latitude: 25,
      longitude: 61
    },
    distance: 1001
  },
  {
    name: 'Steissin BK',
    url: 'https://www.steissin-bk.fi',
    address: 'Jokukatu 3',
    coordinates: {
      latitude: 26,
      longitude: 62
    },
    distance: 1002
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

const getAdditionalRestaurants = (categoryA, categoryB) => [
  {
    name: 'Piritorin Pirikioski',
    url: 'N/A',
    categories: categoryA ? [categoryA] : [],
    address: 'Jokukatu 420',
    coordinates: {
      latitude: 260,
      longitude: 620
    },
    distance: 1022
  },
  {
    name: 'Joku Toinen Paikka',
    url: 'N/A',
    categories: categoryA ? [categoryA] : [],
    address: 'Jokukatu 30',
    coordinates: {
      latitude: 27,
      longitude: 61
    },
    distance: 1003
  },
  {
    name: 'Kauppatorin Nakkikioski',
    url: 'N/A',
    categories: categoryA
      ? categoryB
        ? [categoryA, categoryB]
        : [categoryA]
      : [],
    address: 'Jokukatu 3',
    coordinates: {
      latitude: 26,
      longitude: 62
    },
    distance: 1002
  }
]

let server, restaurants, categories, user, token
beforeEach(async () => {
  dbUtil.connect()
  server = supertest(app)
  restaurants = await dbUtil.createRowsFrom(Restaurant, restaurantData)
  categories = await dbUtil.createRowsFrom(Category, testCategoryData)

  const testSuggestionData = [
    {
      type: 'REMOVE',
      data: restaurants[0]
    },
    {
      type: 'REMOVE',
      data: restaurants[0]
    }
  ]

  await dbUtil.createRowsFrom(Suggestion, testSuggestionData)

  user = await dbUtil.createUser('jaskajoku', 'kissa')
  token = authorization.createToken(user._id, user.username)
})

afterEach(async () => {
  await dbUtil.cleanupAndDisconnect()
})

test('get request to /api/restaurants returns correct number of restaurants', async () => {
  const response = await server.get('/api/restaurants')
  const contents = response.body
  expect(contents.length).toBe(3)
})

test('get request to a specific id returns the correct restaurant', async () => {
  const testRestaurantId = restaurants[0].id

  const response = await server
    .get(`/api/restaurants/${testRestaurantId}`)

  const contents = response.body
  expect(contents).toMatchObject({
    name: 'Torigrilli',
    url: 'https://www.torigrilli.fi',
    categories: []
  })
})

test('getAllMatches request without category ids returns all restaurants', async () => {
  const response = await server
    .post('/api/restaurants/allMatches')
    .send({ categories: [], type: 'some' })

  const contents = response.body
  expect(contents.length).toBe(3)
})

test('getAllMatches request with a category id returns all restaurants belonging to the given category', async () => {
  await dbUtil.createRowsFrom(Restaurant, getAdditionalRestaurants(categories[0].id))

  const response = await server
    .post('/api/restaurants/allMatches')
    .send({ categories: [categories[0].id], type: 'some' })

  const contents = response.body
  expect(contents.length).toBe(3)
  expect(contents.every(restaurant => restaurant.categories.includes(categories[0].id)))
})

test('getAllMatches request with two category ids returns all restaurants that belong to both of the categories', async () => {
  await dbUtil.createRowsFrom(Restaurant, getAdditionalRestaurants(categories[0].id, categories[1].id))

  const response = await server
    .post('/api/restaurants/allMatches')
    .send({ categories: [categories[0].id, categories[1].id], type: 'all' })

  const contents = response.body
  expect(contents.length).toBe(1)
  expect(contents.every(restaurant => restaurant.categories.includes(categories[0].id) && restaurant.categories.includes(categories[1].id)))
})

test('getAllMatches request with type none returns no restaurants in those categories', async () => {
  await dbUtil.createRowsFrom(Restaurant, getAdditionalRestaurants(categories[0].id, categories[1].id))

  const response = await server
    .post('/api/restaurants/allMatches')
    .send({ categories: [categories[1].id], type: 'none' })

  const contents = response.body
  expect(contents.every(restaurant => !restaurant.categories.includes(categories[1].id)))
})

test('getAllMatches responds with status 404 when no restaurants are found with the given filter', async () => {
  const testCategoryId = categories[0].id

  await server
    .post('/api/restaurants/allMatches')
    .send({ categories: [testCategoryId], type: 'some' })
    .expect('Content-Type', /json/)
    .expect(404)
})

test('get request to an invalid id returns code 404', async () => {
  await server.get('/api/restaurants/1').expect(404)
})

describe('when logged in', () => {
  test('post request to /api/restaurants succeeds (with 201) even if no category list is provided', async () => {
    const toBeAdded = getAdditionalRestaurants()[1]
    delete toBeAdded.categories
    await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send(toBeAdded)
      .expect(201)
  })

  test('post request to /api/restaurants with valid data succeeds', async () => {
    const toBeAdded = getAdditionalRestaurants(categories[0].id)[0]
    await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send(toBeAdded)
      .expect(201)
      .expect('Content-Type', /application\/json/i)
  })

  test('post request to /api/restaurants with valid data gets added restaurant as response', async () => {
    const toBeAdded = getAdditionalRestaurants(categories[0].id)[0]

    const response = await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send(toBeAdded)

    const contents = response.body
    expect(contents).toMatchObject(toBeAdded)
  })

  test('post request to /api/restaurants with valid data adds the restaurant to DB', async () => {
    const toBeAdded = getAdditionalRestaurants()[0]
    const response = await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send(toBeAdded)

    const id = response.body.id
    const restaurant = await Restaurant.findById(id)
    expect(restaurant.toJSON()).toMatchObject(toBeAdded)
  })

  test('post request to /api/restaurants without url succeeds', async () => {
    const toBeAdded = getAdditionalRestaurants()[0]
    delete toBeAdded.url
    await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send(toBeAdded)
      .expect(201)
      .expect('Content-Type', /application\/json/i)
  })

  test('post request to /api/restaurants with url containing only whitespace succeeds', async () => {
    const toBeAdded = getAdditionalRestaurants()[0]
    toBeAdded.url = ' \t'.repeat(42)
    await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send(toBeAdded)
      .expect(201)
      .expect('Content-Type', /application\/json/i)
  })

  test('after post request to /api/restaurants with url containing only whitespace, the url is undefined', async () => {
    const toBeAdded = getAdditionalRestaurants()[0]
    toBeAdded.url = ' \t'.repeat(42)
    const response = await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send(toBeAdded)

    const id = response.body.id
    const restaurant = await Restaurant.findById(id)
    expect(restaurant.url).not.toBeDefined()
  })

  test('post request to /api/restaurants with url but without name fails', async () => {
    await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send({ url: 'http://some-url.com' })
      .expect(400)
  })

  test('delete request to /api/restaurants/id with proper ID succeeds with status 204', async () => {
    const id = restaurants[1]._id

    await server
      .delete(`/api/restaurants/${id}`)
      .set('authorization', `bearer ${token}`)
      .expect(204)
  })

  test('delete request to /api/restaurants/id with proper ID removes the restaurant from DB', async () => {
    const id = restaurants[1]._id

    await server
      .delete(`/api/restaurants/${id}`)
      .set('authorization', `bearer ${token}`)

    const restaurant = await Restaurant.findById(id)
    expect(restaurant).toBeNull()
  })

  test('delete request to /api/restaurants/id with proper ID removes any suggestions related to the restaurant', async () => {
    const id = restaurants[0]._id

    await server
      .delete(`/api/restaurants/${id}`)
      .set('authorization', `bearer ${token}`)

    const removedSuggestions = await Suggestion.find({ 'data._id': { $eq: id } })
    expect(removedSuggestions.length).toBe(0)
  })

  test('delete request to /api/restaurants/id with invalid ID fails 400', async () => {
    const id = 'invalid'

    await server
      .delete(`/api/restaurants/${id}`)
      .set('authorization', `bearer ${token}`)
      .expect(400)
  })

  test('delete request to /api/restaurants/id with unknown ID fails with 404', async () => {
    const id = '5e259505d106bf0c27e931a1'

    await server
      .delete(`/api/restaurants/${id}`)
      .set('authorization', `bearer ${token}`)
      .expect(404)
  })

  test('post request to /api/restaurants with very long name fails', async () => {
    await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send({ name: 'abc'.repeat(1337) })
      .expect(400)
  })

  test('post request to /api/restaurants with very long url fails', async () => {
    await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send({ name: 'Ravintola Artjärvi', url: 'abc'.repeat(4242) })
      .expect(400)
  })

  test('put request with valid data responds with 204', async () => {
    const testRestaurantId = restaurants[0].id

    await server
      .put(`/api/restaurants/${testRestaurantId}`)
      .set('authorization', `bearer ${token}`)
      .send({ name: 'Torigrilli Senaatintori', url: 'https://torigrilli.fi', categories: [] })
      .expect(204)
  })

  test('put request with valid data updates the restaurant', async () => {
    const testRestaurantId = restaurants[0].id

    await server
      .put(`/api/restaurants/${testRestaurantId}`)
      .set('authorization', `bearer ${token}`)
      .send({ name: 'Torigrilli Senaatintori', url: 'https://torigrilli.fi', categories: [], address: 'Senaatintori', coordinates: { latitude: 60, longitude: 24 }, distance: 1000 })


    const restaurant = await Restaurant.findById(testRestaurantId)
    expect(restaurant.toJSON()).toEqual({
      id: testRestaurantId,
      name: 'Torigrilli Senaatintori',
      url: 'https://torigrilli.fi',
      categories: [],
      address: 'Senaatintori',
      coordinates: { latitude: 60, longitude: 24 },
      distance: 1000
    })
  })

  test('put request with valid data removes all suggestions related to the restaurant', async () => {
    const testRestaurantId = restaurants[0].id

    await server
      .put(`/api/restaurants/${testRestaurantId}`)
      .set('authorization', `bearer ${token}`)
      .send({ name: 'Torigrilli Senaatintori', url: 'https://torigrilli.fi', categories: [] })

    const removedSuggestions = await Suggestion.find({ 'data._id': { $eq: testRestaurantId } })
    expect(removedSuggestions.length).toBe(0)
  })

  describe('queries update backwards references', () => {
    test('adding a restaurant adds references to the associated categories', async () => {
      const toBeAdded = getAdditionalRestaurants()[0]
      toBeAdded.categories = [categories[0]._id, categories[1]._id]

      const response = await server
        .post('/api/restaurants')
        .set('authorization', `bearer ${token}`)
        .send(toBeAdded)

      const addedId = response.body.id
      const updatedA = await Category.findById(categories[0]._id)
      const updatedB = await Category.findById(categories[1]._id)

      expect(updatedA.restaurants.map(id => id.toString())).toContain(addedId)
      expect(updatedB.restaurants.map(id => id.toString())).toContain(addedId)
    })

    test('removing a restaurant removes references from the associated categories', async () => {
      const toBeAdded = getAdditionalRestaurants()[0]
      toBeAdded.categories = [categories[0]._id, categories[1]._id]

      const rawRestaurant = new Restaurant(toBeAdded)
      const restaurant = await rawRestaurant.save()
      const id = restaurant._id

      await server
        .delete(`/api/restaurants/${id}`)
        .set('authorization', `bearer ${token}`)

      const updatedA = await Category.findById(categories[0]._id)
      const updatedB = await Category.findById(categories[1]._id)

      expect(updatedA.restaurants.map(id => id.toString())).not.toContain(id)
      expect(updatedB.restaurants.map(id => id.toString())).not.toContain(id)
    })

    test('updating a restaurant removes references from categories no longer referenced', async () => {
      const toBeAdded = getAdditionalRestaurants()[0]
      toBeAdded.categories = [categories[0]._id, categories[1]._id]
  
      const rawRestaurant = new Restaurant(toBeAdded)
      const restaurant = await rawRestaurant.save()
      const id = restaurant._id

      await server
        .put(`/api/restaurants/${id}`)
        .set('authorization', `bearer ${token}`)
        .send({
          name: 'Torigrilli Senaatintori',
          url: 'https://torigrilli.fi',
          categories: [
            categories[1]._id,
            categories[2]._id,
          ]
        })

      const removed = await Category.findById(categories[0]._id)
      const notTouched = await Category.findById(categories[1]._id)
      const added = await Category.findById(categories[2]._id)

      expect(removed.restaurants.map(id => id.toString())).not.toContain(id.toString())
      expect(notTouched.restaurants.map(id => id.toString())).toContain(id.toString())
      expect(added.restaurants.map(id => id.toString())).toContain(id.toString())
    })
  })
})

describe('when not logged in', () => {
  test('post fails with status 403', async () => {
    await server
      .post('/api/restaurants')
      .send({ name: 'Torigrilli Senaatintori', url: 'https://torigrilli.fi', categories: [] })
      .expect(403)
  })

  test('put fails with status 403', async () => {
    await server
      .put(`/api/restaurants/${restaurants[0].id}`)
      .send({ name: 'Torigrilli Senaatintori', url: 'https://torigrilli.fi', categories: [] })
      .expect(403)
  })

  test('delete fails with status 403', async () => {
    await server
      .delete(`/api/restaurants/${restaurants[0].id}`)
      .expect(403)
  })
})
