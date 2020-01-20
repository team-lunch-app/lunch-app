import axios from 'axios'
const baseUrl = '/api/restaurants'

const getAll = async () => {
  const response = await axios.get(`${baseUrl}`)
  return response.data
}

const add = async ({ name, url }) => {
  const response = await axios.post(`${baseUrl}`, { name, url })
  return response.data
}

const remove = async (id) => {
  return await axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, add, remove }
