import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { ExpandMore, ExpandLess } from '@material-ui/icons'

import RestaurantEntry from '../RestaurantEntry/RestaurantEntry'
import Filter from '../Filter/Filter/Filter'
import Confetti from '../p5Components/Confetti/Confetti'
import FoodModel from '../p5Components/FoodModel/FoodModel'

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
  let resId = null
  const [restaurant, setRestaurant] = useState()
  const [iteration, setIteration] = useState(maxNumberOfRolls)
  const [isRolling, setRolling] = useState(false)

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
    if (restaurant && restaurant.id) {

      await restaurantService.increaseNotSelectedAmount(restaurant.id)
    }
    const restaurants = await restaurantService.getAllMatches(filter.type, filter.categories, filter.distance)

    if (restaurants.length === 1) {
      setRestaurant(restaurants[0])
      resId = restaurants[0].id
      await restaurantService.increaseResultAmount(resId)
      soundService.playFanfare()
    } else {
      setRolling(true)
      rollAfterTimeout(0, maxTimeBetweenRolls, shuffle(restaurants))
    }
  }

  const rollNext = async (roll, restaurants) => {
    setRestaurant(restaurants[roll % restaurants.length])
    resId = restaurants[roll % restaurants.length].id
    const rollsRemaining = maxNumberOfRolls - roll

    const easterEggDidTrigger = nope.updateAndTryTrigger(restaurants, rollsRemaining)
    if (easterEggDidTrigger) {
      return
    }

    setIteration(roll)
    if (rollsRemaining === 0) {
      await restaurantService.increaseResultAmount(resId)
      soundService.playFanfare()
      setTimeoutHandle(undefined)
      setRolling(false)
    } else {
      const timeout = calculateTimeForNthRoll(roll)
      rollAfterTimeout(roll + 1, timeout, restaurants)
    }
  }

  const selectRestaurantElement = () => {
    if (restaurant && restaurant.error) {
      return <h1 data-testid='randomizer-resultLabel'>{restaurant.error}</h1>
    }

    const hasRestaurant = !!restaurant
    return hasRestaurant
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
  return (
    <div data-testid='randomizer' className='randomizer'>
      <div data-testid='foodmodel-container' className='foodmodel' style={{display: `${(restaurant && !isRolling) ? 'none' : 'inline'}`}}>
        <FoodModel rolling={isRolling} />
      </div>
      {nope.active && <h1>NOPE</h1>}
      {selectRestaurantElement()}
      <RandomizerButton
        onClick={startRolling}
        setError={setError}
        isPicky={isPicky}
        isRolling={isRolling}
        hasResult={restaurant !== undefined && !isRolling}
        maxNumberOfRolls={maxNumberOfRolls}
        rollsRemaining={rollsRemaining}
      />
      <button
        className='randomizer-showFilterButton'
        onClick={() => setFilter({ ...filter, visible: !filter.visible })}>
        {filter.visible ? 'Hide filter ' : 'Set filter '}
        {filter.visible ? <ExpandLess /> : <ExpandMore />}
      </button>
      {restaurant !== undefined && restaurant.notSelectedAmount > 0 && !isRolling && <OverlayTrigger
        placement='right'
        overlay={
          <Tooltip >
            {restaurant.name + ' has won the lottery ' + restaurant.resultAmount + ' times. ' + restaurant.name + ' was not chosen ' + restaurant.notSelectedAmount + ' times.'}
          </Tooltip>
        }
      >
        <p>Approval% : {Math.round((restaurant.resultAmount - restaurant.notSelectedAmount) / restaurant.resultAmount * 100)}  </p>
      </OverlayTrigger>}
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

const RandomizerButton = ({
  onClick,
  setError,
  isRolling,
  isPicky,
  hasResult,
  rollsRemaining,
  maxNumberOfRolls,
}) => {
  const handleClick = async (event) => {
    event.preventDefault()
    try {
      await onClick()
    } catch (errorResponse) {
      setError(errorResponse.response.data.error)
      soundService.playTrombone()
    }
  }

  const label = isRolling
    ? rollsRemaining > maxNumberOfRolls / 3
      ? 'Rolling!'
      : 'Wait for it...'
    : hasResult
      ? 'Gimme another one!'
      : `I'm feeling ${isPicky ? 'picky' : 'lucky'}!`

  return (
    <Button
      data-testid='randomizer-randomizeButton'
      onClick={handleClick}
      variant='success'
      size='lg'
      disabled={isRolling}>
      {label}
    </Button>
  )
}

RandomizerButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  isRolling: PropTypes.bool.isRequired,
  isPicky: PropTypes.bool.isRequired,
  hasResult: PropTypes.bool.isRequired,
  rollsRemaining: PropTypes.number,
  maxNumberOfRolls: PropTypes.number,
}

Randomizer.propTypes = {
  maxNumberOfRolls: PropTypes.number,
  minTimeBetweenRolls: PropTypes.number,
  maxTimeBetweenRolls: PropTypes.number,
  resultWaitTime: PropTypes.number,
}

export default Randomizer
