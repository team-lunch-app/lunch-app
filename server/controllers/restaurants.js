const restaurantsRouter = require('express').Router()
const Restaurant = require('../models/restaurant')

restaurantsRouter.get('/', async (request, response) => {
  const restaurants = await Restaurant
    .find({})
  response.json(restaurants.map(rest => rest.toJSON()))
})

restaurantsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const restaurant = new Restaurant({
    name: body.name,
    url: body.url
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

})

restaurantsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id

  try {
    await Restaurant.findByIdAndRemove(id)
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
