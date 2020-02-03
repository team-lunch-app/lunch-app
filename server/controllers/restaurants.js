const restaurantsRouter = require('express').Router()
const Restaurant = require('../models/restaurant')
const Category = require('../models/category')

const trimAndUndefineIfEmpty = string => {
  if (string === undefined) {
    return undefined
  }

  const trimmedUrl = string.trim()
  return trimmedUrl.length > 0
    ? trimmedUrl
    : undefined
}

// getAll
restaurantsRouter.get('/', async (request, response) => {
  const restaurants = await Restaurant
    .find({}).populate('categories')
  response.json(restaurants.map(rest => rest.toJSON()))
})

// getRandom
restaurantsRouter.post('/random', async (request, response) => {
  let restaurants = await Restaurant
    .find({}).populate('categories')
  const filterCategories = request.body

  const containsCategory = (category) => filterCategories
    .includes(category.id)

  restaurants = (filterCategories.length !== 0)
    ? restaurants.filter(rest => rest.categories && rest.categories.some(containsCategory))
    : restaurants
  
  if (!restaurants || restaurants.length < 1) {
    response.json({ error: 'No restaurants found with the given filter.', name: 'Sorry, No restaurants available :C' })
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

restaurantsRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (body.categories !== undefined) {

    const restaurant = new Restaurant({
      name: body.name,
      url: trimAndUndefineIfEmpty(body.url),
      categories: body.categories
    })

    try {
      const savedRestaurant = await restaurant.save()
      response.json(savedRestaurant.toJSON())
    } catch (error) {
      if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
      }

      console.log('unknown error:', error)
      next(error)
    }
  } else {
    return response.status(400).send({ error: 'Server error: list of categories must be included, even if empty.' })
  }
})

restaurantsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const restaurant = {
    id: request.params.id,
    name: body.name,
    url: trimAndUndefineIfEmpty(body.url),
    categories: body.categories
  }

  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      request.params.id,
      restaurant,
      { new: true }
    )
  
    await request.body.categories.forEach(async categoryId => {
      await Category.findByIdAndUpdate(
        categoryId,
        { $push: { restaurants: request.params.id } }
      )
    })

    response.json(updatedRestaurant.toJSON())
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).send({ error: error.message })
    }

    console.log('unknown error:', error)
    next(error)
  }
})

restaurantsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id

  try {
    const result = await Restaurant.findByIdAndRemove(id)
    if (result === null) {
      return response.status(400).send({ error: 'unknown id' })
    }

    return response.status(200).end()
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return response.status(400).send({ error: error.message })
    }
    console.log('unknown error:', error)
    next(error)
  }
})

module.exports = restaurantsRouter
