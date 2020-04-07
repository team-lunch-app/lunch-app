const statisticsRouter = require('express').Router()
const Statistics = require('../models/statistics')
const Restaurant = require('../models/restaurant')
const Category = require('../models/category')

// getAll
statisticsRouter.get('/', async (request, response, next) => {
  try {
    const statistics = await Statistics
      .find({})
    return response.json(statistics.map(rest => rest.toJSON()))
  }
  catch (error) {
    next(error)
  }
})

// get top n accepted
statisticsRouter.get('/topAccepted/', async (request, response, next, n = 5) => {
  try {
    const restaurants = await Restaurant
      .find({}).populate('categories')
    restaurants.sort((a, b) => {
      if (a.notSelectedAmount === b.notSelectedAmount) {
        return b.resultAmount - a.resultAmount
      } else {
        return a.notSelectedAmount / a.resultAmount - b.notSelectedAmount / b.resultAmount

      }
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

// increase lotteryAmount
statisticsRouter.put('/lotteryAmount/:id', async (request, response, next) => {
  try {
    const statistics = await Statistics.findById(request.params.id)
    statistics.lotteryAmount = statistics.lotteryAmount + 1
    await Statistics.findByIdAndUpdate(statistics.id, statistics)
    return response.status(200).end()
  } catch (error) {
    next(error)
  }
})

// increase notSelectedAmount
statisticsRouter.put('/notSelectedAmount/:id', async (request, response, next) => {
  try {
    const statistics = await Statistics.findById(request.params.id)
    statistics.notSelectedAmount = statistics.notSelectedAmount + 1
    await Statistics.findByIdAndUpdate(statistics.id, statistics)
    return response.status(200).end()
  } catch (error) {
    next(error)
  }
})

// increase selectedAmount
statisticsRouter.put('/selectedAmount/:id', async (request, response, next) => {
  try {
    const statistics = await Statistics.findById(request.params.id)
    statistics.selectedAmount = statistics.selectedAmount + 1
    await Statistics.findByIdAndUpdate(statistics.id, statistics)
    return response.status(200).end()
  } catch (error) {
    next(error)
  }
})

// increase notDecidedAmount
statisticsRouter.put('/notDecidedAmount/:id', async (request, response, next) => {
  try {
    const statistics = await Statistics.findById(request.params.id)
    statistics.notDecidedAmount = statistics.notDecidedAmount + 1
    await Statistics.findByIdAndUpdate(statistics.id, statistics)
    return response.status(200).end()
  } catch (error) {
    next(error)
  }
})

module.exports = statisticsRouter

