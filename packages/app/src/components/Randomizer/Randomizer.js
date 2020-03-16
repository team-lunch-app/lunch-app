import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { ExpandMore, ExpandLess } from '@material-ui/icons'

import RestaurantEntry from '../RestaurantEntry/RestaurantEntry'
import Filter from '../Filter/Filter/Filter'
import Confetti from '../Confetti/Confetti'

import { useNopeEasterEgg } from './nopeEasterEgg'
import { shuffle } from '../../util/shuffle'

import soundService from '../../services/sound'
import restaurantService from '../../services/restaurant'
import './Randomizer.css'

const easingFunc = (max, min, t) => {
  return (max - min) * Math.pow(t, 4) + min
}

const Randomizer = ({
  maxNumberOfRolls = 35,
  minTimeBetweenRolls = 25,
  maxTimeBetweenRolls = 1000,
  resultWaitTime = 1250
}) => {
  const [restaurant, setRestaurant] = useState()
  const [iteration, setIteration] = useState(maxNumberOfRolls)
  const isRolling = iteration < maxNumberOfRolls

  const [filter, setFilter] = useState({
    type: 'some',
    categories: [],
    distance: '',
    visible: false
  })

  const [timeoutHandle, setTimeoutHandle] = useState()
  useEffect(() => () => clearTimeout(timeoutHandle), [timeoutHandle])

  const rollAfterTimeout = (roll, timeout, restaurants) => {
    soundService.playBeep()

    const handle = setTimeout(() => rollNext(roll, restaurants), timeout)
    setTimeoutHandle(handle)
  }

  const nope = useNopeEasterEgg(rollAfterTimeout, {
    triggerChance: 0.025,
    numberOfRolls: Math.ceil(maxNumberOfRolls / 2)
  })

  const setError = (error) => {
    setRestaurant({ error: error })
    if (timeoutHandle) {
      clearTimeout(timeoutHandle)
      setTimeoutHandle()
    }
  }


  const calculateTimeForNthRoll = (n) => {
    const t = n / maxNumberOfRolls
    const time = easingFunc(maxTimeBetweenRolls, minTimeBetweenRolls, t)

    return n === maxNumberOfRolls - 1
      ? time + resultWaitTime
      : time
  }

  const startRolling = async () => {
    const restaurants = await restaurantService.getAllMatches(filter.type, filter.categories, filter.distance)

    if (restaurants.length === 1) {
      setRestaurant(restaurants[0])
      soundService.playFanfare()
    } else {
      rollAfterTimeout(0, maxTimeBetweenRolls, shuffle(restaurants))
    }
  }

  const rollNext = (roll, restaurants) => {
    setRestaurant(restaurants[roll % restaurants.length])
    const rollsRemaining = maxNumberOfRolls - roll

    const easterEggDidTrigger = nope.updateAndTryTrigger(restaurants, rollsRemaining)
    if (easterEggDidTrigger) {
      return
    }

    setIteration(roll)
    if (rollsRemaining === 0) {
      soundService.playFanfare()
      setTimeoutHandle(undefined)
    } else {
      const timeout = calculateTimeForNthRoll(roll)
      rollAfterTimeout(roll + 1, timeout, restaurants)
    }
  }

  const selectRestaurantElement = () => {
    if (restaurant && restaurant.error) {
      return <h1 data-testid='randomizer-resultLabel'>{restaurant.error}</h1>
    }

    return restaurant
      ? isRolling
        ? <h1 data-testid='roll-label'>{restaurant.name}</h1>
        : <>
          <Confetti />
          <RestaurantEntry restaurant={restaurant} showMap />
        </>
      : <h1 data-testid='randomizer-resultLabel'>Hungry? Press the button!</h1>
  }

  const rollsRemaining = maxNumberOfRolls - iteration
  const isPicky = filter.categories.length > 0
  const buttonLabel = isRolling
    ? rollsRemaining > maxNumberOfRolls / 3
      ? 'Rolling!'
      : 'Wait for it...'
    : restaurant
      ? 'Gimme another one!'
      : `I'm feeling ${isPicky ? 'lucky' : 'picky'}!`

  return (
    <div data-testid='randomizer' className='randomizer'>
      {nope.active && <h1>NOPE</h1>}
      {selectRestaurantElement()}
      <RandomizerButton onClick={startRolling} setError={setError} disabled={isRolling}>
        {buttonLabel}
      </RandomizerButton>
      <button
        className='randomizer-showFilterButton'
        onClick={() => setFilter({ ...filter, visible: !filter.visible })}>
        {filter.visible ? 'Hide filter ' : 'Set filter '}
        {filter.visible ? <ExpandLess /> : <ExpandMore />}
      </button>
      <Filter
        emptyMessage={<strong>#IEatAnything</strong>}
        filterCategories={filter.categories}
        setFilterCategories={(value) => setFilter({ ...filter, categories: value })}
        filterType={filter.type}
        setFilterType={(value) => setFilter({ ...filter, type: value })}
        distance={filter.distance}
        setDistance={(value) => setFilter({ ...filter, distance: value })}
        showFilter={filter.visible}
      />
    </div>
  )
}

const RandomizerButton = ({ onClick, setError, disabled, children }) => {
  const handleClick = async (event) => {
    event.preventDefault()
    try {
      await onClick()
    } catch (errorResponse) {
      setError(errorResponse.response.data.error)
      soundService.playTrombone()
    }
  }

  return (
    <Button
      data-testid='randomizer-randomizeButton'
      onClick={handleClick}
      variant='success'
      size='lg'
      disabled={disabled}>
      {children}
    </Button>
  )
}

RandomizerButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node,
}

Randomizer.propTypes = {
  maxNumberOfRolls: PropTypes.number,
  minTimeBetweenRolls: PropTypes.number,
  maxTimeBetweenRolls: PropTypes.number,
  resultWaitTime: PropTypes.number,
}

export default Randomizer
