import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import Filter from './Filter'
import PropTypes from 'prop-types'
import './Randomizer.css'

import restaurantService from '../services/restaurant'

const Randomizer = () => {
  const [restaurant, setRestaurant] = useState({ name: 'Press the button' })
  const [filterCategories, setFilterCategories] = useState([{ id: 1, name: 'pizza' }, { id: 2, name: 'burger' }, { id: 3, name: 'salads' }])

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

  const processUrl = (url) => {
    const hasPrefix = url.startsWith('https://') || url.startsWith('http://') || url.startsWith('//')

    return hasPrefix ? url : `//${url}`
  }

  return (
    <div data-testid='randomizer' className='randomizer'>
      <h1 data-testid='randomizer-resultLabel'>{restaurant.name}</h1>
      {restaurant.url
        ? <p><a data-testid='randomizer-restaurantUrl' href={processUrl(restaurant.url)} target='_blank' rel='noopener noreferrer'>Website</a></p>
        : <></>
      }
      <Button data-testid='randomizer-randomizeButton' onClick={changeRestaurantHandler} variant='success' size='lg'>Go!</Button>
      <Filter setFilterCategories={setFilterCategories} filterCategories={filterCategories}/>
    </div>
  )
}

Randomizer.propTypes = {
}

export default Randomizer
