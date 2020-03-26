import axios from 'axios'
const baseUrl = '/api/places/details/photos'

const getAllPhotosForRestaurant = async (placeId) => {
  const response = await axios.get(`${baseUrl}/${placeId}`)
  return response.data
}

export default { getAllPhotosForRestaurant }
