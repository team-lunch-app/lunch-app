const axios = require('axios').default
const config = require('../config')

const baseUrl = 'https://maps.googleapis.com/maps/api'

const API_KEY = config.googleApiKey
const SEARCH_RADIUS = 10000 // in meters
const LATITUDE = config.originLatitude
const LONGITUDE = config.originLongitude

const FIELDS = 'formatted_address,name,photos,opening_hours,permanently_closed,place_id,geometry,website'

/**
 * Thrown to indicate that the API key has exhausted its monthly quota.
 */
class QueryLimitError extends Error {
  constructor(message) {
    super(message)
    this.name = 'QueryLimit'
  }
}

/**
 * Makes a request to the Google Find Place API to fetch a place based on given keyword.
 * The keyword can be e.g. the place name or part of address etc.
 * 
 * @param {string} keyword search keyword for the API request, matched against address, name and possibly other information
 */
const findPlaceByKeyword = async (keyword) => {
  const outputFormat = 'json'   // 'json' | 'xml'
  const inputType = 'textquery' // 'textquery' | 'phonenumber'
  const response = await axios.get(`${baseUrl}/place/findplacefromtext/${outputFormat}?key=${API_KEY}&input=${keyword}&inputtype=${inputType}&fields=${FIELDS}`)
  switch (response.data.status) {
    case 'OK':
      return response.data.candidates
    case 'ZERO_RESULTS':
      return []
    case 'OVER_QUERY_LIMIT':
      throw new QueryLimitError('Monthly quota exceeded!')
    default:
      throw new Error('Finding place failed')
  }
}

/**
 * Finds additional details for a place ID. Use autocomplete or find place queries to fetch a place ID, and
 * once sure that the ID is for the correct place, you can start querying for details.
 * 
 * Result is unparsed response from the Google Place Details API. Refer to https://developers.google.com/places/web-service/details#fields
 * for details on response fields.
 * 
 * If the result contains an array of HTML attributions, they must be shown to the user due to legal reasons.
 * 
 * @param {string} placeId The Google Place ID to search for
 * @param {string} fields The desired fields from Google Place result (for example 'formatted_address,name,photos,rating')
 * 
 * @returns null if place was not found, the object containing the details otherwise
 */
const findDetails = async (placeId, fields) => {
  const outputFormat = 'json'   // 'json' | 'xml'
  const response = await axios.get(`${baseUrl}/place/details/${outputFormat}?key=${API_KEY}&place_id=${placeId}&fields=${fields}`)
  switch (response.data.status) {
    case 'ZERO_RESULTS':          // Place ID was valid but removed/hidden
    case 'NOT_FOUND':             // Place ID does not exist
    case 'INVALID_REQUEST':       // Malformed Place ID
      return null
    case 'OK':                    // Place found and OK
      return {
        attributions: response.data.html_attributions,
        result: response.data.result
      }
    case 'OVER_QUERY_LIMIT':      // Quota exceeded
      throw new QueryLimitError('Monthly quota exceeded!')
    default:                      // Something unexpected
      throw new Error('Finding place details failed')
  }
}

/**
 * Makes a request to the Google Place Autocomplete API to fetch a place prediction based on currently typed string.
 * Returns an array of prediction objects with format as per Google API documentation.
 * 
 * The "strictbounds" option is set to constrain the results to be inside the defined radius (without
 * the option the radius is mere "suggestion" and e.g. returns results from Japan when searching for sushi places).
 * 
 * Why are the coordinates duplicated, passed in both the "origin" and the "location" options? The former is used
 * for calculating the straight-line distance to the predicted place, while the latter is used for filtering the
 * results.
 * 
 * @param {string} text currently typed search string
 */
const autocomplete = async (text) => {
  const outputFormat = 'json'   // 'json' | 'xml'
  const response = await axios.get(`${baseUrl}/place/autocomplete/${outputFormat}?input=${text}&types=establishment&strictbounds&origin=${LATITUDE},${LONGITUDE}&location=${LATITUDE},${LONGITUDE}&radius=${SEARCH_RADIUS}&key=${API_KEY}`)
  switch (response.data.status) {
    case 'OK':
      return response.data.predictions
    case 'ZERO_RESULTS':
      return []
    case 'OVER_QUERY_LIMIT':
      throw new QueryLimitError('Monthly quota exceeded!')
    default:
      throw new Error('Autocomplete failed')
  }
}

/**
 * Finds all (10 at the most) photos for a place with a valid Google Place ID. Then fetches
 * the url:s for the photos with a little help from the helper function getUrl().
 * 
 * Returns an array of photos with fields width, height, photo_reference, html_attributions[]
 * and url.
 * 
 * @param {string} placeId The Google Place ID to search for
 */
const getAllPhotos = async (placeId) => {
  const fields = 'photos'
  const details = await findDetails(placeId, fields)
  if (details === null) {
    return null
  }

  const photoObjects = details.result.photos

  const modifiedList = await Promise.all(photoObjects.map(async photo => {
    return {...photo, url: await getUrl(photo.photo_reference)}
  }))

  return modifiedList
}

/**
 * Fetches a url for a photo from the Google Places Place Photos API. Returns a string containing the url.
 * 
 * The maxwidth (maxheight) parameter in the query defines the maximum width (height) for the photo. In this case, 
 * photos wider than 360 pixels will be scaled to match the width while keeping its original aspect ratio.
 * The number must be between 1 and 1600. This parameter (or maxheight) is required for the request.
 * 
 * @param {string} reference The photo_reference attribute of the photo
 */
const getUrl = async (reference) => {
  const width = 360
  const height = 360
  const result = await axios.get(`${baseUrl}/place/photo?maxwidth=${width}&maxheight=${height}&photoreference=${reference}&key=${API_KEY}`)
  const photoUrl = result.request._redirectable._options.href
  return photoUrl
}

module.exports = {
  findPlaceByKeyword,
  autocomplete,
  findDetails,
  QueryLimitError,
  getAllPhotos
}
