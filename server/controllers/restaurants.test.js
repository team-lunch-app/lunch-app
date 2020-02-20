const supertest = require('supertest')
const Restaurant = require('../models/restaurant')
const Category = require('../models/category')
const app = require('../app')
const authorization = require('../util/authorization')

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

let server, restaurants, categories, user, token
beforeEach(async () => {
  dbUtil.connect()
  server = supertest(app)
  restaurants = await dbUtil.createRowsFrom(Restaurant, restaurantData)
  categories = await dbUtil.createRowsFrom(Category, testCategoryData)
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

test('getRandom request returns a restaurant', async () => {
  const response = await server.post('/api/restaurants/random')
    .send({ categories: [], type: 'some' })

  expect(restaurants.map(restaurant => restaurant.name)).toContain(response.body.name)
})

test('getRandom request with a category id returns a restaurant belonging to the given category', async () => {
  const testCategoryId = categories[0].id
  await dbUtil.createRowsFrom(Restaurant, [
    { name: 'Kauppatorin Nakkikioski', url: 'N/A', categories: [testCategoryId] }
  ])

  const response = await server
    .post('/api/restaurants/random')
    .send({ categories: [testCategoryId], type: 'some' })

  const contents = response.body
  expect(contents).toMatchObject({
    name: 'Kauppatorin Nakkikioski',
    url: 'N/A'
  })
})

test('getRandom responds with status 404 when no restaurants are found with the given filter', async () => {
  const testCategoryId = categories[0].id

  await server
    .post('/api/restaurants/random')
    .send({ categories: [testCategoryId], type: 'some' })
    .expect('Content-Type', /json/)
    .expect(404)
})

test('getRandom response has an error when no restaurants are found with the given filter', async () => {
  const testCategoryId = categories[0].id

  const { body } = await server
    .post('/api/restaurants/random')
    .send({ categories: [testCategoryId], type: 'some' })

  expect(body).toHaveProperty('error')
})

test('getRandom return the correct number of categories when multiple filter options are provided with filter option "some"', async () => {
  await dbUtil.createRowsFrom(Restaurant, [
    { name: 'Kauppatorin Nakkikioski', url: 'N/A', categories: [categories[0].id] },
    { name: 'Kalevankadun Salaattibaari', url: 'N/A', categories: [categories[1].id] }
  ])

  const response = await server.post('/api/restaurants/random')
    .send({ categories: [categories[0].id, categories[1].id], type: 'some' })

  const name = response.body.name
  expect(name === 'Kauppatorin Nakkikioski' || name === 'Kalevankadun Salaattibaari').toBeTruthy()
})

test('getRandom return the correct number of categories when multiple filter options are provided with filter option "every"', async () => {
  await dbUtil.createRowsFrom(Restaurant, [
    { name: 'Kauppatorin Nakkikioski', url: 'N/A', categories: [categories[0].id] },
    { name: 'Kalevankadun Salaattibaari', url: 'N/A', categories: [categories[1].id, categories[0].id] }
  ])

  const response = await server.post('/api/restaurants/random')
    .send({ categories: [categories[0].id, categories[1].id], type: 'all' })

  const name = response.body.name
  expect(name === 'Kalevankadun Salaattibaari').toBeTruthy()
})

test('getRandom return the correct number of categories when multiple filter options are provided with filter option "none"', async () => {
  await dbUtil.createRowsFrom(Restaurant, [
    { name: 'Kauppatorin Nakkikioski', url: 'N/A', categories: [categories[0].id] },
    { name: 'Kalevankadun Salaattibaari', url: 'N/A', categories: [categories[1].id, categories[0].id] }
  ])

  const response = await server.post('/api/restaurants/random')
    .send({ categories: [categories[0].id, categories[1].id], type: 'none' })
    .expect(200)

  const name = response.body.name
  expect(name === 'Kauppatorin Nakkikioski' || name === 'Kalevankadun Salaattibaari').toBeFalsy()
})


test('get request to an invalid id returns code 404', async () => {
  await server.get('/api/restaurants/1').expect(404)
})

describe('when logged in', () => {
  test('post request to /api/restaurants succeeds (with 201) even if no category list is provided', async () => {
    await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send({ name: 'Ravintola Artjärvi', url: 'N/A', })
      .expect(201)
  })

  test('post request to /api/restaurants with valid data succeeds', async () => {
    await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send({ name: 'Ravintola Artjärvi', url: 'N/A', categories: [] })
      .expect(201)
      .expect('Content-Type', /application\/json/i)
  })

  test('post request to /api/restaurants with valid data gets added restaurant as response', async () => {
    const categoryId = categories[0].id

    const response = await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
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
      .set('authorization', `bearer ${token}`)
      .send({ name: 'Ravintola Artjärvi', url: 'N/A' })

    const id = response.body.id
    const restaurant = await Restaurant.findById(id)
    expect(restaurant).toBeDefined()
  })

  test('post request to /api/restaurants without url succeeds', async () => {
    await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send({ name: 'Ravintola Artjärvi', categories: [] })
      .expect(201)
      .expect('Content-Type', /application\/json/i)
  })

  test('post request to /api/restaurants with url containing only whitespace succeeds', async () => {
    await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send({ name: 'Ravintola Artjärvi', url: '   ', categories: [] })
      .expect(201)
      .expect('Content-Type', /application\/json/i)
  })

  test('after post request to /api/restaurants with url containing only whitespace, the url is undefined', async () => {
    const response = await server
      .post('/api/restaurants')
      .set('authorization', `bearer ${token}`)
      .send({ name: 'Ravintola Artjärvi', url: '   ', categories: [] })

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
      .send({ name: 'Torigrilli Senaatintori', url: 'https://torigrilli.fi', categories: [] })


    const restaurant = await Restaurant.findById(testRestaurantId)
    expect(restaurant.toJSON()).toEqual({
      id: testRestaurantId,
      name: 'Torigrilli Senaatintori',
      url: 'https://torigrilli.fi',
      categories: []
    })
  })

  describe('queries update backwards references', () => {
    test('adding a restaurant adds references to the associated categories', async () => {
      const response = await server
        .post('/api/restaurants')
        .set('authorization', `bearer ${token}`)
        .send({
          name: 'Ravintola Artjärvi',
          url: 'https://www.joku.fi',
          categories: [
            categories[0]._id,
            categories[1]._id,
          ]
        })

      const addedId = response.body.id

      const updatedA = await Category.findById(categories[0]._id)
      const updatedB = await Category.findById(categories[1]._id)

      expect(updatedA.restaurants.map(id => id.toString())).toContain(addedId)
      expect(updatedB.restaurants.map(id => id.toString())).toContain(addedId)
    })

    test('removing a restaurant removes references from the associated categories', async () => {
      const rawRestaurant = new Restaurant({
        name: 'Ravintola Artjärvi',
        url: 'https://www.joku.fi',
        categories: [
          categories[0]._id,
          categories[1]._id,
        ]
      })
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
      const rawRestaurant = new Restaurant({
        name: 'Ravintola Artjärvi',
        url: 'https://www.joku.fi',
        categories: [
          categories[0]._id,
          categories[1]._id,
        ]
      })
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
