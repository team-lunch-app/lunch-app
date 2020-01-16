import React, { useState } from 'react'

const Randomizer = ({ restaurantService }) => {
  const [restaurantName, setRestaurantName] = useState('')

  const changeRestaurantHandler = newText => event => {
    event.preventDefault()
    const restaurants = /* restaurantService.getAll() */ [{name: 'Rax'}, {name:'Fazer'}, {name:'Arnolds'}]
    const newRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)].name

    setRestaurantName(newRestaurant)
  }

  return (
    <div data-testid='randomizer'>
      <h1 data-testid='randomizer-resultLabel'>{restaurantName}</h1>
      <button data-testid='randomizer-randomizeButton' onClick={changeRestaurantHandler('Rax')}>Go!</button>
    </div>
  )
}

export default Randomizer