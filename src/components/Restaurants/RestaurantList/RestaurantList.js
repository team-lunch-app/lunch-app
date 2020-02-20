import React, { useState, useEffect } from 'react'
import { Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import RestaurantEntry from '../RestaurantEntry/RestaurantEntry'
import restaurantService from '../../../services/restaurant'
import authService from '../../../services/authentication'
import suggestionService from '../../../services/suggestion'

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState()
  const token = authService.getToken()
  const isLoggedIn = token !== undefined

  useEffect(() => {
    restaurantService.getAll().then(setRestaurants)
  }, [])

  const removeRestaurant = async (restaurant) => {
    if (isLoggedIn) {
      if (!window.confirm(`Are you sure you want to remove "${restaurant.name}"?`)) {
        return
      }

      const result = await restaurantService.remove(restaurant.id)
      if (result && result.status === 204) {
        setRestaurants(restaurants.filter(r => r.id !== restaurant.id))
      }
    } else {
      if (window.confirm(`Suggest the removal of ${restaurant.name}?`)) {
        await suggestionService.removeRestaurant(restaurant)
      }
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

export default RestaurantList
