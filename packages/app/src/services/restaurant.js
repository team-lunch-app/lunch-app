import axios from 'axios'
import authService from './authentication'

const baseUrl = '/api/restaurants'

const getAll = async () => {
  const response = await axios.get(`${baseUrl}`)
  return response.data
}

const getOneById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const add = async (restaurant) => {
  const response = await axios.post(`${baseUrl}`, restaurant, { headers: { Authorization: `bearer ${authService.getToken()}` } })
  return response.data
}

const update = async (restaurant) => {
  const response = await axios.put(`${baseUrl}/${restaurant.id}`, restaurant, { headers: { Authorization: `bearer ${authService.getToken()}` } })
  return response.data
}

const remove = async (id) => {
  return await axios.delete(`${baseUrl}/${id}`, { headers: { Authorization: `bearer ${authService.getToken()}` } })
}

const getAllMatches = async (filterType, filterCategories) => {
  const filterIds = filterCategories.map(category => category.id)
  const response = await axios.post(`${baseUrl}/allMatches`, { categories: filterIds, type: filterType })
  return response.data
}

export default {
  getAll,
  getOneById,
  add,
  remove,
  getAllMatches,
  update
}
