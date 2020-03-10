import axios from 'axios'
const baseUrl = '/api/auth'

let token

const getToken = () => {
  return token
}

const setToken = (newToken) => {
  token = newToken
}

const login = async (username, password) => {
  const response = await axios.post(`${baseUrl}/login`, { username: username, password: password })
  setToken(response.data.token)

  const passwordExpired = response.data.passwordExpired || false
  return { token, passwordExpired }
}

const logout = () => {
  setToken(undefined)
}

const getAllUsers = async () => {
  const response = await axios.get(`${baseUrl}/users`, { headers: { authorization: `bearer ${token}` } })
  return response.data
}

const register = async (user) => {
  const response = await axios.post(`${baseUrl}/users`, user, { headers: { authorization: `bearer ${token}` } })
  return response.data
}

export default {
  login,
  logout,
  getAllUsers,
  getToken,
  register
}
