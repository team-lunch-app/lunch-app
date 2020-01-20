import React, { useState } from 'react'

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
    <div data-testid='randomizer'>
      <h1 data-testid='randomizer-resultLabel'>{restaurantName}</h1>
      <button data-testid='randomizer-randomizeButton' onClick={changeRestaurantHandler}>Go!</button>
    </div>
  )
}

export default Randomizer
