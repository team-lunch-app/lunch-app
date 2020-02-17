import axios from 'axios'
const baseUrl = '/api/auth'

let token = localStorage.getItem('usertoken')

const getToken = () => {
  return token
}

const setToken = (newToken) => {
  token = newToken
  localStorage.setItem('usertoken', token)
}

const login = async (username, password) => {
  const response = await axios.post(`${baseUrl}/login`, { username: username, password: password })
  setToken(response.data.token)
}

const logout = () => {
  setToken(undefined)
  localStorage.removeItem('usertoken')
}

export default {
  login,
  logout,
  getToken
}
