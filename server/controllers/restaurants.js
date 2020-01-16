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
  } catch (exception) {
    console.log('error', exception)
    next(exception)
  } 

})

module.exports = restaurantsRouter
