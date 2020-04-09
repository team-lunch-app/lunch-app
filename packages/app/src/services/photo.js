import axios from 'axios'

import testData from '../util/testData'
const baseUrl = '/api/places/details/photos'

const testing = false

const getAllPhotosForRestaurant = async (placeId) => {
  const response = testing
    ? testData.getAllPhotosForRestaurant()
    :  await axios.get(`${baseUrl}/${placeId}`)
  return response.data
}

export default { getAllPhotosForRestaurant }
