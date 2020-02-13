import axios from 'axios'
const baseUrl = '/api/categories'

const getAll = async () => {
  const response = await axios.get(`${baseUrl}`)
  return response.data
}

const getOneById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const add = async (category) => {
  const response = await axios.post(`${baseUrl}`, category)
  return response.data
}

const update = async (category) => {
  const response = await axios.put(`${baseUrl}/${category.id}`, category)
  return response.data
}

const remove = async (id) => {
  return await axios.delete(`${baseUrl}/${id}`)
}

export default {
  getAll,
  getOneById,
  add,
  update,
  remove
}

