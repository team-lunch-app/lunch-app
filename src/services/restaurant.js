import axios from 'axios'
const baseUrl = '/api/restaurants'

const getAll = async () => {
  const response = await axios.get(`${baseUrl}`)
  return response.data
}

const getOneById = async (id) => {
  const restaurants = await getAll()
  const restaurantWithId = restaurants.find((restaurant) => restaurant.id === id)
  return restaurantWithId

  /*
  // Varsinainen toteutus
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
  */
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

const remove = async (id) => {
  return await axios.delete(`${baseUrl}/${id}`)
}

const getRandom = async (categoryList) => {
  //STUB
  // SIIRTYY BACKENDIIN
  let restaurants = await getAll()
  const containsCategory = (category) => categoryList
    .map(listCategory => listCategory.name)
    .includes(category)
  restaurants = (categoryList.length !== 0) 
    ? restaurants.filter(rest => rest.categories.some(containsCategory))
    : restaurants
  return restaurants[Math.floor(Math.random() * restaurants.length)]
}

export default {
  getAll,
  getOneById,
  add,
  remove,
  getRandom
}
