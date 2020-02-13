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
}

const logout = () => {
  setToken(undefined)
}

export default {
  login,
  logout,
  getToken
}
