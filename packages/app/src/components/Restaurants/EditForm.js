import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Alert from 'react-bootstrap/Alert'
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
  const [error, setError] = useState('Loading...')


  useEffect(() => {
    if (id !== undefined) {
      restaurantService
        .getOneById(id)
        .then(fetched => {
          setRestaurant({
            ...fetched,
            name: fetched.name || '',
            url: fetched.url || '',
            address: fetched.address || '',
            categories: fetched.categories || [],
            coordinates: fetched.coordinates || undefined,
          })
          setError()
        })
        .catch(() => {
          setRestaurant(createDefaultRestaurant())
          setError('Could not find restaurant with the given ID')
        })
    }
  }, [id])

  const token = authService.getToken()
  const isLoggedIn = token !== undefined

  const handleSubmit = async (restaurant) => {
    if (isLoggedIn) {
      restaurantService.update(restaurant)
    } else {
      suggestionService.editRestaurant(restaurant)
      window.alert('Your suggestion has been received. An admin will have to approve it.')
    }
  }

  return error
    ? <Alert data-testid='error-msg-generic' variant='danger' >{error}</Alert >
    : <RestaurantForm
      restaurant={restaurant}
      setRestaurant={setRestaurant}
      onSubmit={handleSubmit}
      submitMessage={!isLoggedIn ? 'Suggest' : 'Update'}
      suggestTooltip={'Send a suggestion to edit this restaurant'}
    />
}

EditForm.propTypes = {
  id: PropTypes.any,
}

export default EditForm
