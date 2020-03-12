import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { ExpandMore, ExpandLess } from '@material-ui/icons'
import Filter from '../Filter/Filter/Filter'
import RestaurantEntry from '../RestaurantEntry/RestaurantEntry'
import soundService from '../../services/sound'
import restaurantService from '../../services/restaurant'
import Confetti from '../Confetti/Confetti'
import './Randomizer.css'


const Randomizer = () => {
  const maxNumberOfRotations = 28
  const minTimeBetweenRotations = 15  // in milliseconds
  const maxTimeBetweenRotations = 750 // in milliseconds

  const [restaurant, setRestaurant] = useState()
  const [disableButton, setDisableButton] = useState(false)
  const [filterType, setFilterType] = useState('some')
  const [filterCategories, setFilterCategories] = useState([])
  const [distance, setDistance] = useState('')
  const [showFilter, setShowFilter] = useState(false)

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const rollNext = (iteration, restaurants) => {
    const count = restaurants.length
    const nextRestaurant = restaurants[iteration % count]

    const iterationsRemaining = maxNumberOfRotations - iteration
    soundService.playBeep()
    setRestaurant(nextRestaurant)
    if (iterationsRemaining === 0) {
      soundService.playFanfare()
      setDisableButton(false)
    } else {
      const delta = iteration / maxNumberOfRotations
      const interpolatedTime = (1 - delta) * minTimeBetweenRotations + delta * maxTimeBetweenRotations // Linear interpolation
      setTimeout(() => rollNext(iteration + 1, restaurants), interpolatedTime)
    }
  }

  const handleRoll = async (event) => {
    event.preventDefault()
    try {
      setDisableButton(true)
      const restaurants = await restaurantService.getAllMatches(filterType, filterCategories, distance)
      if (restaurants.length > 1) {
        setTimeout(() => rollNext(0, restaurants), maxTimeBetweenRotations)
      } else {
        setRestaurant(restaurants[0])
        soundService.playFanfare()
      }
    } catch (errorResponse) {
      const error = errorResponse.response.data
      setRestaurant({ name: error.error, showMap: false })
      soundService.playTrombone()
      setDisableButton(false)
    }
  }

  const restaurantElement = restaurant
    ? <RestaurantEntry restaurant={restaurant} />
    : <h1 data-testid='randomizer-resultLabel'>Hungry? Press the button!</h1>

  const mapVisible = restaurant && restaurant.showMap

  return (
    <div data-testid='randomizer' className='randomizer'>
      {mapVisible && <Confetti />}
      {restaurantElement}
      <Button data-testid='randomizer-randomizeButton' onClick={handleRoll} variant='success' size='lg' disabled={disableButton}>
        {mapVisible
          ? 'Gimme another one!'
          : `I'm feeling ${filterCategories.length === 0 ? 'lucky' : 'picky'}!`
        }
      </Button>
      <button
        className='randomizer-showFilterButton'
        onClick={() => setShowFilter(!showFilter)}>
        {showFilter
          ? 'Hide filter '
          : 'Set filter '
        }
        {showFilter
          ? <ExpandLess />
          : <ExpandMore />
        }
      </button>
      <Filter
        emptyMessage={<strong>#IEatAnything</strong>}
        setFilterCategories={setFilterCategories}
        filterCategories={filterCategories}
        filterType={filterType}
        setFilterType={setFilterType}
        distance={distance}
        setDistance={setDistance}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
      />
    </div>
  )
}

Randomizer.propTypes = {
}

export default Randomizer
