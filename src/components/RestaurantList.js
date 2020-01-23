import React, { useState, useEffect } from 'react'
import { Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import RestaurantEntry from './RestaurantEntry'

const RestaurantList = ({ restaurantService }) => {
  const [restaurants, setRestaurants] = useState()

  useEffect(() => {
    restaurantService.getAll().then(setRestaurants)
  }, [restaurantService])

  const removeRestaurant = async (restaurant) => {
    if (!window.confirm(`Are you sure you want to remove "${restaurant.name}"?`)) {
      return
    }

    const result = await restaurantService.remove(restaurant.id)
    if (result && result.status === 200) {
      setRestaurants(restaurants.filter(r => r.id !== restaurant.id))
    }
  }

  // Show loading text when restaurants haven't yet been fetched
  if (restaurants === undefined || restaurants === null) {
    return <div data-testid='restaurantList-loading'>Loading...</div>
  }

  return (
    <div data-testid='restaurantList'>
      <Link to='/'><Button data-testid='restaurantList-backButton'>Back</Button></Link>
      <h1 data-testid='restaurantList-title'>Restaurants</h1>
      {restaurants.length === 0
        ? <Alert data-testid='restaurantList-alertMessage' variant='warning'>Sorry, No restaurants available :C</Alert>
        : restaurants.map((restaurant) => <RestaurantEntry key={restaurant.id} restaurant={restaurant} onRemove={removeRestaurant} />)
      }
    </div>
  )
}

RestaurantList.propTypes = {
  restaurantService: PropTypes.shape({
    getAll: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }).isRequired
}

export default RestaurantList
