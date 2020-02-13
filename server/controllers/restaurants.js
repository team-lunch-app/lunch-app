const restaurantsRouter = require('express').Router()
const Restaurant = require('../models/restaurant')
const Category = require('../models/category')
const authorization = require('../util/authorization')
const features = require('../../util/features')

const addRestaurantToCategories = async (restaurantId, categoryIds) => {
  return await Category.updateMany(
    { _id: { $in: [...categoryIds] } },
    { $addToSet: { restaurants: restaurantId } }
  )
}

const removeRestaurantFromCategories = async (restaurantId, categoryIds) => {
  await Category.updateMany(
    { _id: { $in: [...categoryIds] } },
    { $pull: { restaurants: { $in: [restaurantId] } } },
  )
}

/**
 * Trims the string and returns undefined if the string is empty afterwards. This is useful
 * to avoid passing <code>null</code> to DB queries where no entry is desired.
 * @param {string} string - string to sanitize
 */
const trimAndUndefineIfEmpty = string => {
  if (string === undefined) {
    return undefined
  }

  const trimmedUrl = string.trim()
  return trimmedUrl.length > 0
    ? trimmedUrl
    : undefined
}

/**
 * Parses restaurant from given request body and id
 * @param {any} body - request body, containing the restaurant name, url and categories
 * @param {any} [id] - optional ID to assign to the restaurant
 */
const parseRestaurant = (body, id) => {
  const name = body.name
  const url = trimAndUndefineIfEmpty(body.url)
  const categories = body.categories || []
  return { id, name, url, categories }
}

// getAll
restaurantsRouter.get('/', async (request, response) => {
  const restaurants = await Restaurant
    .find({}).populate('categories')
  response.json(restaurants.map(rest => rest.toJSON()))
})

// getRandom
restaurantsRouter.post('/random', async (request, response) => {
  let restaurants = await Restaurant.find({}).populate('categories')

  const filter = request.body
  const filterCategories = filter.categories || []
  const filterType = filter.type || 'some'

  const containsCategory = (category) => {
    return filterCategories
      .includes(category.id)
  }

  const filterFunc = (categories, filterType) => {
    switch (filterType) {
      case 'some': {
        return categories.some(containsCategory)
      }
      case 'all': {
        return categories.length > 0 && categories.length >= filterCategories.length
          ? categories.every(containsCategory)
          : false
      }
      case 'none': {
        return categories.length > 0
          ? categories.some(c => !containsCategory(c))
          : true
      }
      default: {
        return false
      }
    }
  }

  restaurants = (filterCategories.length !== 0)
    ? restaurants.filter(restaurant => restaurant.categories && filterFunc(restaurant.categories, filterType))
    : restaurants

  if (!restaurants || restaurants.length < 1) {
    response.status(404).json({ error: 'No restaurants found with the given filter.' })
  } else {
    const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)]
    response.json(randomRestaurant.toJSON())
  }
})

// getOne
restaurantsRouter.get('/:id', async (request, response) => {
  try {
    const restaurant = await Restaurant
      .findById(request.params.id).populate('categories')
    response.json(restaurant.toJSON())
  } catch (e) {
    return response.status(404).send({ error: 'Not found' })
  }
})

// add
restaurantsRouter.post('/', async (request, response, next) => {
  try {
    if (features.endpointAuth) {
      authorization.requireAuthorized(request)
    }
    const restaurant = await new Restaurant(parseRestaurant(request.body)).save()

    // FIXME: If this throws, restaurant references might be corrupt. Might be better to immediately catch here
    //        and remove the restaurant?
    await addRestaurantToCategories(restaurant._id, restaurant.categories)
    return response.status(201).json(restaurant.toJSON())
  }
  catch (error) {
    next(error)
  }
})

// update
restaurantsRouter.put('/:id', async (request, response, next) => {
  try {
    if (features.endpointAuth) {
      authorization.requireAuthorized(request)
    }

    const restaurant = parseRestaurant(request.body, request.params.id)
    const { categories: oldCategories } = await Restaurant.findByIdAndUpdate(restaurant.id, restaurant)
    await removeRestaurantFromCategories(restaurant.id, oldCategories)
    await addRestaurantToCategories(restaurant.id, restaurant.categories)

    return response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// delete
restaurantsRouter.delete('/:id', async (request, response, next) => {
  try {
    if (features.endpointAuth) {
      authorization.requireAuthorized(request)
    }
    const id = request.params.id

    return await Restaurant.findByIdAndRemove(id) === null
      ? response.status(404).send({ error: 'unknown id' })
      : response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = restaurantsRouter
