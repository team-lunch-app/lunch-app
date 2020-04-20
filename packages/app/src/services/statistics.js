import axios from 'axios'

const baseUrl = '/api/statistics'

const getAll = async () => {
  const response = await axios.get(`${baseUrl}/`)
  return response.data
}

const getTopAccepted = async () => {
  const response = await axios.get(`${baseUrl}/topAccepted/`)
  return response.data
}

const getTopResult = async () => {
  const response = await axios.get(`${baseUrl}/topResult/`)
  return response.data
}

export default {
  getAll,
  getTopAccepted,
  getTopResult,
}
