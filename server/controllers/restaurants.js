const restaurantsRouter = require('express').Router()
const Restaurant = require('../models/restaurant')

const trimAndUndefineIfEmpty = string => {
  if (string === undefined) {
    return undefined
  }

  const trimmedUrl = string.trim()
  return trimmedUrl.length > 0
    ? trimmedUrl
    : undefined
}

restaurantsRouter.get('/', async (request, response) => {
  const restaurants = await Restaurant
    .find({}).populate('categories')
  response.json(restaurants.map(rest => rest.toJSON()))
})

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
