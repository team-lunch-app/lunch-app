const Suggestion = require('../models/suggestion')
const authorization = require('../util/authorization')
const Restaurant = require('../models/restaurant')
const { tryCreateRestaurant, tryRemoveRestaurant, tryUpdateRestaurant } = require('./restaurants')

const suggestionsRouter = require('express').Router()

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

const parseSuggestion = (body, type) => {
  const address = body.address
  const coordinates = body.coordinates
  const distance = body.distance
  const name = body.name
  const url = trimAndUndefineIfEmpty(body.url)
  const categories = body.categories || []
  const _id = body._id
  const placeId = body.placeId || undefined
  const parsed = { type, data: { _id, name, url, categories, address, coordinates, distance, placeId } }
  return parsed
}

// suggest to add a restaurant
suggestionsRouter.post('/add', async (request, response, next) => {
  try {
    const suggestion = await new Suggestion(parseSuggestion(request.body, 'ADD')).save()

    return response.status(201).json(suggestion.toJSON())
  } catch (error) {
    next(error)
  }
})

// suggest to edit a restaurant
suggestionsRouter.post('/edit', async (request, response, next) => {
  try {
    const restaurant = await Restaurant.findById(request.body.id)
    if (!restaurant) {
      return response.status(400).end()
    }
    const suggestion = await new Suggestion(parseSuggestion({ ...request.body, _id: restaurant._id }, 'EDIT')).save()
    return response.status(201).json(suggestion.toJSON())
  } catch (error) {
    next(error)
  }
})

// suggest to remove a restaurant
suggestionsRouter.post('/remove', async (request, response, next) => {
  try {
    if (request.body.id) {
      const found = await Restaurant.findById(request.body.id)
      const suggestion = await new Suggestion(parseSuggestion(found, 'REMOVE')).save()
      return response.status(201).json(suggestion.toJSON())
    } else {
      return response.status(400).end()
    }
  } catch (error) {
    next(error)
  }
})

// approve
suggestionsRouter.post('/approve/:id', async (request, response, next) => {
  try {
    await authorization.requireAuthorized(request)

    const id = request.params.id
    const suggestion = await Suggestion.findById(id)

    if (!suggestion) {
      return response.status(404).json({ error: 'invalid suggestion id' })
    }

    if (suggestion.type === 'ADD') {
      const restaurant = suggestion.data.toJSON()

      const created = await tryCreateRestaurant(restaurant)
      await Suggestion.findByIdAndRemove(id)

      return response.status(201).json(created.toJSON())
    } else if (suggestion.type === 'REMOVE') {
      const restaurant = suggestion.data.toJSON()
      await tryRemoveRestaurant(restaurant.id)

      return response.status(204).end()
    } else if (suggestion.type === 'EDIT') {
      const restaurant = suggestion.data.toJSON()
      await tryUpdateRestaurant(restaurant)
      return response.status(200).end()
    }

    return response.status(404).end()
  }
  catch (error) {
    next(error)
  }
})

// reject
suggestionsRouter.post('/reject/:id', async (request, response, next) => {
  try {
    await authorization.requireAuthorized(request)

    const id = request.params.id
    const removed = await Suggestion.findByIdAndRemove(id)
    return removed
      ? response.status(204).end()
      : response.status(404).end()
  }
  catch (error) {
    next(error)
  }
})

// getAll
suggestionsRouter.get('/', async (request, response, next) => {
  try {
    await authorization.requireAuthorized(request)

    const suggestions = await Suggestion
      .find({})
    return response.json(suggestions.map(rest => rest.toJSON()))
  }
  catch (error) {
    next(error)
  }
})

module.exports = suggestionsRouter
