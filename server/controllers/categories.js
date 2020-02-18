const categoryRouter = require('express').Router()
const Category = require('../models/category')
const authorization = require('../util/authorization')
const features = require('../../util/features')

categoryRouter.get('/', async (request, response) => {
  const categories = await Category
    .find({}).populate('restaurants')
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

categoryRouter.get('/:id', async (request, response, next) => {
  try {
    if (features.endpointAuth) {
      authorization.requireAuthorized(request)
    }
    const category = await Category.findById(request.params.id)
    return category 
      ? response.json(category.toJSON())
      : response.status(404).send({ error: 'unknown id' })
  } catch (error) {
    next(error)
  }
})

categoryRouter.put('/:id', async (request, response, next) => {

  try {
    if (features.endpointAuth) {
      authorization.requireAuthorized(request)
    }
    const category = request.body
    const updatedCategory = await Category.findByIdAndUpdate(category.id, category)
    response.json(updatedCategory.toJSON()).status(204).end()
  } catch (error) {
    next(error)
  }
})

categoryRouter.delete('/:id', async (request, response, next) => {
  try {
    if (features.endpointAuth) {
      authorization.requireAuthorized(request)
    }
    const id = request.params.id

    return await Category.findByIdAndRemove(id) === null
      ? response.status(400).send({ error: 'unknown id' })
      : response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = categoryRouter
