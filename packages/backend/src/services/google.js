const axios = require('axios').default
const config = require('../config')

const baseUrl = 'https://maps.googleapis.com/maps/api'

const API_KEY = config.googleApiKey

const FIELDS = 'formatted_address,name,photos,opening_hours,permanently_closed,place_id,geometry'


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
  return response.data.candidates
}

module.exports = {
  findPlaceByKeyword
}
