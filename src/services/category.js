import axios from 'axios'
import authService from './authentication'
const baseUrl = '/api/categories'

const token = authService.getToken()

const getAll = async () => {
  const response = await axios.get(`${baseUrl}`)
  return response.data
}

const getOneById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, { headers:
   { Authorization: `bearer ${token}` }
  })
  return response.data
  
}

const add = async (category) => {
  const response = await axios.post(`${baseUrl}`, category,{ headers:
    { Authorization: `bearer ${token}` }
  })
  return response.data
}

const update = async (category) => {
  const response = await axios.put(`${baseUrl}/${category.id}`, category, { headers:
    { Authorization: `bearer ${token}` }
  })
  return response.data
}

const remove = async (id) => {
  return await axios.delete(`${baseUrl}/${id}`, { headers:
    { Authorization: `bearer ${token}` }
  })
}

export default {
  getAll,
  getOneById,
  add,
  update,
  remove
}
