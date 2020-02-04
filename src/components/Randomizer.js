import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import Filter from './Filter'
import './Randomizer.css'

import restaurantService from '../services/restaurant'

const Randomizer = () => {
  const [restaurant, setRestaurant] = useState({ name: 'Press the button' })
  const [filterCategories, setFilterCategories] = useState([])

  const changeRestaurantHandler = async (event) => {
    event.preventDefault()

    try {
      const newRestaurant = await restaurantService.getRandom(filterCategories)
      if (newRestaurant) {
        setRestaurant(newRestaurant)
      }
    } catch (errorResponse) {
      const error = errorResponse.response.data
      setRestaurant({ name: error.error })
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
      <Button data-testid='randomizer-randomizeButton' onClick={changeRestaurantHandler} variant='success' size='lg'>
        {`I'm feeling ${filterCategories.length === 0 ? 'lucky' : 'picky'}!`}
      </Button>
      <Filter
        emptyMessage={<strong>#NoFilter</strong>}
        setFilterCategories={setFilterCategories}
        filterCategories={filterCategories} />
    </div>
  )
}

Randomizer.propTypes = {
}

export default Randomizer
