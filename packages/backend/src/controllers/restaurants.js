const restaurantsRouter = require('express').Router()
const Restaurant = require('../models/restaurant')
const Category = require('../models/category')
const Suggestion = require('../models/suggestion')
const authorization = require('../util/authorization')

const tryCreateRestaurant = async (restaurant) => {
  const created = await new Restaurant(restaurant).save()

  // FIXME: If this throws, restaurant references might be corrupt. Might be better to immediately catch here
  //        and remove the restaurant?
  await addRestaurantToCategories(created._id, created.categories)

  return created
}

const tryRemoveRestaurant = async (id) => {
  const removedRestaurant = await Restaurant.findByIdAndRemove(id)
  if (!removedRestaurant) {
    return null
  }
  await removeRestaurantFromCategories(removedRestaurant.id, removedRestaurant.categories)
  await tryRemoveSuggestionsByRestaurant(removedRestaurant.id)
  return removedRestaurant
}

const tryUpdateRestaurant = async (restaurant) => {
  const { categories: oldCategories } = await Restaurant.findByIdAndUpdate(restaurant.id, restaurant)
  await removeRestaurantFromCategories(restaurant.id, oldCategories)
  await addRestaurantToCategories(restaurant.id, restaurant.categories)
  await tryRemoveSuggestionsByRestaurant(restaurant.id)
}

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

const tryRemoveSuggestionsByRestaurant = async (restaurantId) => {
  const removedSuggestions = await Suggestion.deleteMany({ 'data._id': { $eq: restaurantId } })

  if (!removedSuggestions) {
    return null
  }

  return removedSuggestions
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
  const filterType = request.body.type || 'some'
  const filterCategories = request.body.categories || []

  let restaurants
  if (filterCategories.length > 0) {
    switch (filterType) {
      case 'some': {
        restaurants = await Restaurant.find({
          'categories': { '$in': filterCategories }
        })
        break
      }

      case 'all': {
        restaurants = await Restaurant.find({
          'categories': { '$all': filterCategories }
        })
        break
      }

      case 'none': {
        restaurants = await Restaurant.find({
          'categories': { '$nin': filterCategories }
        })
        break
      }
    }
  } else {
    restaurants = await Restaurant
      .find({}).populate('categories')
  }

  if (restaurants.length > 0) {
    const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)]
    response.json(restaurant.toJSON())
  } else {
    response.status(404).json({ error: 'No restaurants found with the given filter.' })
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
    authorization.requireAuthorized(request)

    const restaurant = await tryCreateRestaurant(parseRestaurant(request.body))
    return response.status(201).json(restaurant.toJSON())
  }
  catch (error) {
    next(error)
  }
})

// update
restaurantsRouter.put('/:id', async (request, response, next) => {
  try {
    authorization.requireAuthorized(request)

    await tryUpdateRestaurant(parseRestaurant(request.body, request.params.id))

    return response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// delete
restaurantsRouter.delete('/:id', async (request, response, next) => {
  try {
    authorization.requireAuthorized(request)

    const id = request.params.id
    return await tryRemoveRestaurant(id)
      ? response.status(204).end()
      : response.status(404).send({ error: 'unknown id' })
  } catch (error) {
    next(error)
  }
})

module.exports = {
  restaurantsRouter,
  tryRemoveRestaurant,
  tryCreateRestaurant
}
