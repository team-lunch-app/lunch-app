import React, { useState } from 'react'
import RestaurantForm from './form/RestaurantForm'

import authService from '../../services/authentication'
import restaurantService from '../../services/restaurant'
import suggestionService from '../../services/suggestion'

const AddForm = () => {
  const [restaurant, setRestaurant] = useState({
    name: '',
    url: '',
    categories: [],
    address: '',
    distance: 1000
  })

  const token = authService.getToken()
  const isLoggedIn = token !== undefined

  const handleSubmit = async (restaurant) => {
    if (isLoggedIn) {
      restaurantService.add(restaurant)
    } else {
      suggestionService.addRestaurant(restaurant)
      window.alert('Your suggestion has been received. An admin will have to approve it.')
    }
  }

  return (
    <RestaurantForm
      restaurant={restaurant}
      setRestaurant={setRestaurant}
      onSubmit={handleSubmit}
      suggestTooltip={'Send a suggestion to add this restaurant'}
      submitMessage={!isLoggedIn ? 'Suggest' : 'Add'} />
  )
}

export default AddForm
