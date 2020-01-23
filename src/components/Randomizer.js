import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './Randomizer.css'

const Randomizer = ({ restaurantService }) => {
  const [restaurant, setRestaurant] = useState({ name: 'Press the button' })

  const changeRestaurantHandler = async (event) => {
    event.preventDefault()
    const restaurants = await restaurantService.getAll()
    if (restaurants && restaurants.length > 0) {
      const newRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)]
      setRestaurant(newRestaurant)
    } else {
      setRestaurant({ name: 'Sorry, No restaurants available :C' })
    }
  }

  return (
    <div data-testid='randomizer' className='randomizer'>
      <h1 data-testid='randomizer-resultLabel'>{restaurant.name}</h1>
      {restaurant.url
        ? <p><a data-testid='randomizer-restaurantUrl' href={restaurant.url}>Website</a></p>
        : <></>
      }
      <Button data-testid='randomizer-randomizeButton' onClick={changeRestaurantHandler} variant='success' size='lg'>Go!</Button>
    </div>
  )
}

Randomizer.propTypes = {
  restaurantService: PropTypes.shape({
    getAll: PropTypes.func.isRequired
  }).isRequired
}

export default Randomizer
