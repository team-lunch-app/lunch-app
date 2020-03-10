import axios from 'axios'
const baseUrl = '/api/auth'

let token, userId
const getToken = () => {
  return token
}

const getUserId = () => {
  return userId
}

const setLoggedInUser = (newToken, newUserId) => {
  token = newToken
  userId = newUserId
  window.sessionStorage.setItem('lunch-app-user', JSON.stringify({
    token,
    userId
  }))
}

const restoreUser = () => {
  const userJson = window.sessionStorage.getItem('lunch-app-user')

  if (userJson) {
    const userInfo = JSON.parse(userJson)
    const newToken = userInfo.token
    const newUserId = userInfo.userId
    if (newToken && newUserId) {
      setLoggedInUser(newToken, newUserId)
    } else (
      setLoggedInUser()
    )
  }
}

const login = async (username, password) => {
  const response = await axios.post(`${baseUrl}/login`, { username: username, password: password })
  setLoggedInUser(response.data.token, response.data.userId)

  const passwordExpired = response.data.passwordExpired || false
  return { token, passwordExpired }
}

const changePassword = async (oldPassword, newPassword) => {
  const response = await axios.post(
    `${baseUrl}/users/password`, 
    { password: oldPassword, newPassword },
    { headers: { authorization: `bearer ${token}` } }
  )
  return response.data
}

const logout = () => {
  setLoggedInUser()
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
  getUserId,
  register,
  changePassword,
  restoreUser,
}
