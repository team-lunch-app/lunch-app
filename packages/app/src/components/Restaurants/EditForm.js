import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import RestaurantForm from './form/RestaurantForm'

import authService from '../../services/authentication'
import restaurantService from '../../services/restaurant'
import suggestionService from '../../services/suggestion'

const EditForm = ({ id }) => {
  const createDefaultRestaurant = () => ({
    name: '',
    url: '',
    categories: [],
    address: '',
    coordinates: {
      latitude: 60,
      longitude: 24
    },
    distance: 1000
  })
  const [restaurant, setRestaurant] = useState(!id ? createDefaultRestaurant() : undefined)
  const [error, setError] = useState('')


  useEffect(() => {
    if (id !== undefined) {
      restaurantService
        .getOneById(id)
        .then(fetched => setRestaurant({
          ...fetched,
          name: fetched.name || '',
          url: fetched.url || '',
          categories: fetched.categories || [],
        }))
        .catch(() => {
          setRestaurant(createDefaultRestaurant())
          setError('Could not find restaurant with the given ID')
        })
    }
  }, [id])

  const token = authService.getToken()
  const isLoggedIn = token !== undefined

  return (
    <RestaurantForm
      restaurant={restaurant}
      setRestaurant={setRestaurant}
      error={error}
      setError={setError}
      onSubmit={isLoggedIn ? restaurantService.update : suggestionService.editRestaurant}
      submitMessage={!isLoggedIn ? 'Suggest' : 'Update'}
      suggestTooltip={'Send a suggestion to edit this restaurant'} />
  )
}

RestaurantForm.propTypes = {
  id: PropTypes.any,
}

export default EditForm