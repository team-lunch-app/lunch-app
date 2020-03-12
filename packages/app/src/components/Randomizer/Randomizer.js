import React, { useState } from 'react'
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
  const minTimeBetweenRotations = 15 // in milliseconds
  const [restaurant, setRestaurant] = useState({ name: 'Press the button' })
  const [disableButton, setDisableButton] = useState(false)
  const [filterType, setFilterType] = useState('some')
  const [filterCategories, setFilterCategories] = useState([])
  const [distance, setDistance] = useState('')
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
          setRestaurant({ ...restaurants[restaurantIndex], showMap: false })
          soundService.playBeep()
        }
        setRestaurant({ ...restaurants[restaurantIndex], showMap: true })
      } else {
        setRestaurant({ ...restaurants[0], showMap: true })
      }
      soundService.playFanfare()
    } catch (errorResponse) {
      const error = errorResponse.response.data
      setRestaurant({ name: error.error, showMap: false })
      soundService.playTrombone()
    }
    setDisableButton(false)
  }

  return (
    <div data-testid='randomizer' className='randomizer'>
      {restaurant.showMap && <Confetti />}
      {restaurant && <RestaurantEntry restaurant={restaurant} />}
      <Button data-testid='randomizer-randomizeButton' onClick={roll} variant='success' size='lg' disabled={disableButton}>
        {restaurant.showMap
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
