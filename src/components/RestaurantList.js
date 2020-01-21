import React, { useState, useEffect } from 'react'
import { Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const RestaurantList = ({ restaurantService }) => {
  const [restaurants, setRestaurants] = useState()

  useEffect(() => {
    restaurantService.getAll().then(setRestaurants)
  }, [restaurantService])

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
      : restaurants.map((restaurant) => <p key={restaurant.id} data-testid='restaurantList-restaurantEntry'>{restaurant.name}</p>)
      }
    </div>
  )
}

export default RestaurantList
