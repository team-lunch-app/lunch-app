const placesRouter = require('express').Router()

const google = require('../services/google')


/**
 * Tries to guess address based on a prediction. The description field usually should contain
 * enough information for getting a close-enough looking address.
 * 
 * @param {*} prediction the prediction to make the guess for
 */
const tryGuessAddress = (prediction) => {
  return prediction.description
}


/**
 * Tries to guess address based on a prediction. Uses the structured_formatting property as
 * for establishments its main_text sub-property should usually be the name of the place.
 * 
 * If prediction has no structured_formatting, returns the description (which likely
 * contains the address and thus is quite sub-optimal).
 * 
 * @param {*} prediction the prediction to make the guess for
 */
const tryGuessName = (prediction) => {
  const maybeStructuredFormatting = prediction.structured_formatting
  return maybeStructuredFormatting === undefined
    ? prediction.description
    : maybeStructuredFormatting.main_text
}


placesRouter.get('/details/:place_id', async (request, response, next) => {
  try {
    const placeId = request.params.place_id
    const fields = 'formatted_address,name,photos,opening_hours,permanently_closed,place_id,geometry'
    const details = await google.findDetails(placeId, fields)
    if (details === null) {
      return response.status(404).send({ error: 'No places found with the given place id' })
    }

    return response.status(200).send(details)
  } catch (error) {
    next(error)
  }
})

placesRouter.get('/details/reviews/:place_id', async (request, response, next) => {
  try {
    const placeId = request.params.place_id
    const fields = 'rating,reviews'
    const details = await google.findDetails(placeId, fields)
    if (details === null) {
      return response.status(404).send({ error: 'No places found with the given place id' })
    }

    return response.status(200).send(details)
  } catch (error) {
    next(error)
  }
})

placesRouter.get('/autocomplete/:name', async (request, response, next) => {
  try {
    const text = request.params.name

    const predictions = await google.autocomplete(text)

    const result = predictions
      .map(prediction => ({
        name: tryGuessName(prediction),
        address: tryGuessAddress(prediction),
        distance: prediction.distance_meters,
        placeId: prediction.place_id
      }))

    return response.status(200).send(result)
  } catch (error) {
    next(error)
  }
})

placesRouter.get('/details/photos/:place_id', async (request, response, next) => {
  const placeId = request.params.place_id
  
  try {
    const photos = await google.getAllPhotos(placeId)
    if (photos === null) {
      return response.status(404).send({ error: 'No photos found.' })
    }
    return response.status(200).send(photos)
  } catch (error){
    next(error)
  }
})

module.exports = placesRouter
