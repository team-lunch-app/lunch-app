const categoryRouter = require('express').Router()
const Category = require('../models/category')

categoryRouter.get('/', async (request, response) => {
  const categories = await Category
    .find({}) // populate
  response.json(categories.map(rest => rest.toJSON()))
})

categoryRouter.post('/', async (request, response, next) => {
  const body = request.body

  const category = new Category({
    name: body.name,
    restaurants: body.restaurants
  })

  try {
    const savedCategory = await category.save()
    response.json(savedCategory.toJSON())
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).send({ error: error.message })
    }

    console.log('unknown error:', error)
    next(error)
  }
})

module.exports = categoryRouter
