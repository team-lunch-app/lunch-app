import axios from 'axios'
const baseUrl = '/api/restaurants'

const getAll = async () => {
  const response = await axios.get(`${baseUrl}`)
  return response.data
}

const getOneById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const add = async ({
  name,
  url
}) => {
  const response = await axios.post(`${baseUrl}`, {
    name,
    url
  })
  return response.data
}

const update = async({ restaurant }) => {
  const response = await axios.put(`${baseUrl}/${restaurant.id}`, restaurant)
  return response.data
}

const remove = async (id) => {
  return await axios.delete(`${baseUrl}/${id}`)
}

const getRandom = async (filterCategories) => {
  const response = await axios.post(`${baseUrl}/random`, filterCategories)
  return response.data
}

export default {
  getAll,
  getOneById,
  add,
  remove,
  getRandom,
  update
}
