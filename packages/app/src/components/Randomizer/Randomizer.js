import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import Filter from '../Filter/Filter/Filter'
import RestaurantEntry from '../RestaurantEntry/RestaurantEntry'
import soundService from '../../services/sound'
import restaurantService from '../../services/restaurant'
import './Randomizer.css'


const Randomizer = () => {
  const maxNumberOfRotations = 28
  const minTimeBetweenRotations = 15 // in milliseconds
  const [restaurant, setRestaurant] = useState({ name: 'Press the button' })
  const [disableButton, setDisableButton] = useState(false)
  const [filterType, setFilterType] = useState('some')
  const [filterCategories, setFilterCategories] = useState([])
  const [distance, setDistance] = useState()
  const [showFilter, setShowFilter] = useState(false)

  const sleep = async (duration) => {
    return new Promise(r => setTimeout(r, duration))
  }

  const roll = async (event) => {
    event.preventDefault()
    setDisableButton(true)
    try {
      const restaurants = await restaurantService.getAllMatches(filterType, filterCategories, distance)
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
      <button 
        className='randomizer-showFilterButton' 
        onClick={() => setShowFilter(!showFilter)}>
        {showFilter
          ? 'Hide filter ' 
          : 'Set filter '
        }
        {showFilter 
          ? <FontAwesomeIcon icon={faAngleUp}/>
          : <FontAwesomeIcon icon={faAngleDown}/>
        }
      </button>
      <Filter
        emptyMessage={<strong>#I'llEatAnything</strong>}
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
