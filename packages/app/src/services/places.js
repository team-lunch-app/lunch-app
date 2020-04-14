import axios from 'axios'
const baseUrl = '/api/places'

const getSuggestions = async (text) => {
  const suggestions = await axios.get(`${baseUrl}/autocomplete/${text}`)
  return suggestions.data
}

const getRestaurant = async (id) => {
  const restaurant = await axios.get(`${baseUrl}/details/addform/${id}`)
  return restaurant.data.result
}

export default { getSuggestions, getRestaurant }
