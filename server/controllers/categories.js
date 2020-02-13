const categoryRouter = require('express').Router()
const Category = require('../models/category')
const authorization = require('../util/authorization')
const features = require('../../util/features')

categoryRouter.get('/', async (request, response) => {
  const categories = await Category
    .find({}) // populate
  response.json(categories.map(rest => rest.toJSON()))
})

categoryRouter.post('/', async (request, response, next) => {
  try {
    if (features.endpointAuth) {
      authorization.requireAuthorized(request)
    }

    const body = request.body

    const category = new Category({
      name: body.name.trim(),
      restaurants: body.restaurants
    })

    const savedCategory = await category.save()
    response.json(savedCategory.toJSON())
  } catch (error) {
    next(error)
  }
})

module.exports = categoryRouter
