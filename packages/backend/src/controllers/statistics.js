const statisticsRouter = require('express').Router()
const Statistics = require('../models/statistics')
const Restaurant = require('../models/restaurant')
const Category = require('../models/category')

const findOrCreateStatistics = async () => {
  const statistics = await Statistics.findOne({})
  if (!statistics) {
    const statistics = new Statistics({})

    const saved = await statistics.save()
    return saved
  }
  return statistics
}

// find or create and get
statisticsRouter.get('/', async (request, response, next) => {
  const statistics = await findOrCreateStatistics()
  return response.json(statistics.toJSON())
})

// get top n accepted
statisticsRouter.get('/topAccepted/', async (request, response, next, n = 5) => {
  try {
    const restaurants = await Restaurant
      .find({}).populate('categories')
    restaurants.sort((a, b) => {
      const acceptRatioA = a.resultAmount !== 0
        ? a.selectedAmount / a.resultAmount
        : 0
      const acceptRatioB = b.resultAmount !== 0
        ? b.selectedAmount / b.resultAmount
        : 0

      return acceptRatioB - acceptRatioA
    })
    topRestaurants = restaurants.slice(0, n)
    response.json(topRestaurants.map(rest => rest.toJSON()))
  }
  catch (error) {
    next(error)
  }
})

// get top n lottery winners
statisticsRouter.get('/topResult', async (request, response, next, n = 5) => {
  try {
    const restaurants = await Restaurant
      .find({}).populate('categories')
    restaurants.sort((a, b) => {
      return b.resultAmount - a.resultAmount
    })
    topRestaurants = restaurants.slice(0, n)
    response.json(topRestaurants.map(rest => rest.toJSON()))
  }
  catch (error) {
    next(error)
  }
})

// get top n categories by restaurant amount
statisticsRouter.get('/biggestCategories', async (request, response, next, n = 5) => {
  try {
    const categories = await Category
      .find({}).populate('restaurants')
    categories.sort((a, b) => {
      return b.restaurants.length - a.restaurants.length
    })
    topCategories = categories.slice(0, n)
    response.json(topCategories.map(rest => rest.toJSON()))
  }
  catch (error) {
    next(error)
  }
})

// get top n categories by total accepted count
statisticsRouter.get('/topCategories', async (request, response, next, n = 5) => {
  try {
    const categories = await Category
      .find({}).populate('restaurants')
    categories.sort((a, b) => {
      let acceptedA = 0
      let acceptedB = 0
      a.restaurants.forEach(r => acceptedA += r.resultAmount - r.notSelectedAmount)
      b.restaurants.forEach(r => acceptedB += r.resultAmount - r.notSelectedAmount)
      return acceptedB - acceptedA
    })
    topCategories = categories.slice(0, n)
    response.json(topCategories.map(rest => rest.toJSON()))
  }
  catch (error) {
    next(error)
  }
})

module.exports = { findOrCreateStatistics, statisticsRouter }

