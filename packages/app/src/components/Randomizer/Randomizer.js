import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import Filter from '../Filter/Filter/Filter'
import RestaurantEntry from '../RestaurantEntry/RestaurantEntry'
import soundService from '../../services/sound'
import './Randomizer.css'

import restaurantService from '../../services/restaurant'


const Randomizer = () => {
  const maxNumberOfRotations = 28
  const minTimeBetweenRotations = 15 // in milliseconds
  const [restaurant, setRestaurant] = useState({ name: 'Press the button' })
  const [disableButton, setDisableButton] = useState(false)
  const [filterType, setFilterType] = useState('some')
  const [filterCategories, setFilterCategories] = useState([])

  const sleep = async (duration) => {
    return new Promise(r => setTimeout(r, duration))
  }

  const roll = async (event) => {
    event.preventDefault()
    setDisableButton(true)
    try {
      const restaurants = await restaurantService.getAllMatches(filterType, filterCategories)
      if (restaurants.length > 1) {
        let restaurantIndex = Math.floor(Math.random() * restaurants.length)
        for (let rotations = 0; rotations <= maxNumberOfRotations; rotations++) {
          await sleep(rotations * minTimeBetweenRotations)
          restaurantIndex = (restaurantIndex + 1) > (restaurants.length - 1) ? 0 : restaurantIndex + 1
          setRestaurant(restaurants[restaurantIndex])
          soundService.playBeep()
        }
      } else {
        setRestaurant(restaurants[0])
      }
      soundService.playFanfare()
    } catch (errorResponse) {
      const error = errorResponse.response.data
      setRestaurant({ name: error.error })
      soundService.playTrombone()
    }
    setDisableButton(false)
  }

  return (
    <div data-testid='randomizer' className='randomizer'>
      {restaurant && <RestaurantEntry restaurant={restaurant} />}
      <Button data-testid='randomizer-randomizeButton' onClick={roll} variant='success' size='lg' disabled={disableButton}>
        {`I'm feeling ${filterCategories.length === 0 ? 'lucky' : 'picky'}!`}
      </Button>
      <Filter
        emptyMessage={<strong>#NoFilter</strong>}
        setFilterCategories={setFilterCategories}
        filterCategories={filterCategories}
        filterType={filterType}
        setFilterType={setFilterType} />
    </div>
  )
}

Randomizer.propTypes = {
}

export default Randomizer
