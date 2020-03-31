import axios from 'axios'
import testdata from '../util/testData'
const baseUrl = '/api/places'

const testing = false

const getSuggestions = async (text) => {
  const suggestions = testing
    ? testdata.getSuggestions()
    : await axios.get(`${baseUrl}/autocomplete/${text}`)
  return suggestions.data
}

const getRestaurant = async (id) => {
  const restaurant = testing
    ? testdata.getRestaurant()
    : await axios.get(`${baseUrl}/details/addform/${id}`)
  return restaurant.data.result
}

export default { getSuggestions, getRestaurant }
