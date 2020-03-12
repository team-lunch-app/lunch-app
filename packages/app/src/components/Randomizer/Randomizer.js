import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { ExpandMore, ExpandLess } from '@material-ui/icons'
import PropTypes from 'prop-types'
import Filter from '../Filter/Filter/Filter'
import RestaurantEntry from '../RestaurantEntry/RestaurantEntry'
import soundService from '../../services/sound'
import restaurantService from '../../services/restaurant'
import Confetti from '../Confetti/Confetti'
import './Randomizer.css'


const Randomizer = ({ maxNumberOfRotations = 35, minTimeBetweenRotations = 25, maxTimeBetweenRotations = 1000, resultWaitTime = 1250 }) => {
  const [restaurant, setRestaurant] = useState()
  const [isRolling, setRolling] = useState(false)
  const [filterType, setFilterType] = useState('some')
  const [filterCategories, setFilterCategories] = useState([])
  const [distance, setDistance] = useState('')
  const [showFilter, setShowFilter] = useState(false)

  const [timeoutHandle, setTimeoutHandle] = useState()
  const [nope, setNope] = useState()

  useEffect(() => {
    return () => clearTimeout(timeoutHandle)
  }, [timeoutHandle])

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  const easingFunc = (max, min, t) => {
    //return (1 - t) * min + t * max // Linear interpolation
    return (max - min) * Math.pow(t, 4) + min
  }

  const rollNext = (iteration, restaurants) => {
    const count = restaurants.length
    const nextRestaurant = restaurants[iteration % count]
    setRestaurant(nextRestaurant)

    const iterationsRemaining = maxNumberOfRotations - iteration
    if (iterationsRemaining === 0) {
      if (Math.random() < 0.025) {
        setNope(true)
        setTimeoutHandle(setTimeout(() => rollNext(Math.ceil(maxNumberOfRotations / 2), shuffle(restaurants)), minTimeBetweenRotations))
        return
      } else {
        soundService.playFanfare()
        setRolling(false)
        setTimeoutHandle()
        return
      }
    }

    if (iterationsRemaining < Math.ceil(maxNumberOfRotations / 2) - 5) {
      setNope(false)
    }

    soundService.playBeep()

    const t = iteration / maxNumberOfRotations
    let interpolatedTime = easingFunc(maxTimeBetweenRotations, minTimeBetweenRotations, t)
    if (iterationsRemaining === 1) {
      interpolatedTime += resultWaitTime
    }

    setTimeoutHandle(setTimeout(() => rollNext(iteration + 1, restaurants), interpolatedTime))
  }

  const handleRoll = async (event) => {
    event.preventDefault()
    try {
      const restaurants = shuffle(await restaurantService.getAllMatches(filterType, filterCategories, distance))
      //const restaurants = [restaurantsA[0]]
      if (restaurants.length > 1) {
        setRolling(true)
        setTimeoutHandle(setTimeout(() => rollNext(0, restaurants), maxTimeBetweenRotations))
      } else {
        setRestaurant(restaurants[0])
        soundService.playFanfare()
      }
    } catch (errorResponse) {
      console.log(errorResponse)
      const error = errorResponse.response.data
      setRestaurant({ name: error.error, showMap: false })
      soundService.playTrombone()
      setRolling(false)
    }
  }

  const restaurantElement = restaurant
    ? <RestaurantEntry restaurant={restaurant} showMap={!isRolling} />
    : <h1 data-testid='randomizer-resultLabel'>Hungry? Press the button!</h1>

  const mapVisible = restaurant && !isRolling

  return (
    <div data-testid='randomizer' className='randomizer'>
      {mapVisible && <Confetti />}
      {nope && <h1>NOPE</h1>}
      {(isRolling && restaurant)
        ? <h1 data-testid='roll-label'>{restaurant.name}</h1>
        : restaurantElement}
      <Button data-testid='randomizer-randomizeButton' onClick={handleRoll} variant='success' size='lg' disabled={isRolling}>
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
  maxNumberOfRotations: PropTypes.number,
  minTimeBetweenRotations: PropTypes.number,
  maxTimeBetweenRotations: PropTypes.number,
  resultWaitTime: PropTypes.number,
}

export default Randomizer
