import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import './Randomizer.css'

const Randomizer = ({ restaurantService }) => {
  const [restaurantName, setRestaurantName] = useState('Press the button')

  const changeRestaurantHandler = async (event) => {
    event.preventDefault()
    const restaurants = await restaurantService.getAll()
    if (restaurants && restaurants.length > 0) {
      const newRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)].name
      setRestaurantName(newRestaurant)
    } else {
      setRestaurantName('Sorry, No restaurants available :C')
    }
  }

  return (
    <div data-testid='randomizer' className='randomizer'>
      <h1 data-testid='randomizer-resultLabel'>{restaurantName}</h1>
      <Button data-testid='randomizer-randomizeButton' onClick={changeRestaurantHandler} variant='success' size='lg'>Go!</Button>
    </div>
  )
}

export default Randomizer
