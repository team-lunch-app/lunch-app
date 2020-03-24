import axios from 'axios'
const baseUrl = '/api/places/details/reviews'

const getCommentsForRestaurant = async (placeId) => {
  const response = await axios.get(`${baseUrl}/${placeId}`)
  return response.data.result  
}

export default { getCommentsForRestaurant }
