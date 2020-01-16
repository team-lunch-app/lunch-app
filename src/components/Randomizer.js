import React, { useState } from 'react'

const Randomizer = ({ restaurantService }) => {
  const [restaurantName, setRestaurantName] = useState(null)

  const changeRestaurantHandler = newText => event => {
    event.preventDefault()
    const restaurants = restaurantService.getAll()
    if (restaurants) {
      const newRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)].name
      setRestaurantName(newRestaurant)
    } else {
      setRestaurantName('Error: No restaurants in the database')
    }
  }

  return (
    <div data-testid='randomizer'>
      <h1 data-testid='randomizer-resultLabel'>{restaurantName}</h1>
      <button data-testid='randomizer-randomizeButton' onClick={changeRestaurantHandler('Rax')}>Go!</button>
    </div>
  )
}

export default Randomizer