import axios from 'axios'
import authService from './authentication'
const baseUrl = '/api/suggestions'

const getAll = async () => {
  const response = await axios.get(`${baseUrl}`, { headers: { authorization: `bearer ${authService.getToken()}` } })
  return response.data
}

const approve = async (id) => {
  const response = await axios.post(`${baseUrl}/approve/${id}`, undefined, { headers: { authorization: `bearer ${authService.getToken()}` } })
  return response.data
}

const reject = async (id) => {
  const response = await axios.post(`${baseUrl}/reject/${id}`, undefined,  { headers: { authorization: `bearer ${authService.getToken()}` } })
  return response.data
}

const addRestaurant = async (restaurant) => {
  const response = await axios.post(`${baseUrl}/add`, restaurant)
  return response.data
}

const removeRestaurant = async (restaurant) => {
  const response = await axios.post(`${baseUrl}/remove`, restaurant)
  return response.data
}

export default {
  getAll,
  approve,
  reject,
  addRestaurant,
  removeRestaurant
}
