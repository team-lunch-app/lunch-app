import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import Filter from '../Filter/Filter/Filter'
import './Randomizer.css'

import restaurantService from '../../services/restaurant'

const Randomizer = () => {
  const [restaurant, setRestaurant] = useState({ name: 'Press the button' })
  const [filterType, setFilterType] = useState('some')
  const [filterCategories, setFilterCategories] = useState([])

  const changeRestaurantHandler = async (event) => {
    event.preventDefault()

    try {
      const newRestaurant = await restaurantService.getRandom(filterType, filterCategories)
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

  const confirmLeave = (event) => {
    if (!window.confirm(`This URL is user-submitted content that leads to an external website. 
    Are you sure you want to leave? URL: ${restaurant.url}`)) {
      event.preventDefault()
    }
  }

  return (
    <div data-testid='randomizer' className='randomizer'>
      <h1 data-testid='randomizer-resultLabel'>{restaurant.name}</h1>
      {restaurant.url
        ? <p>
          <a data-testid='randomizer-restaurantUrl'
            className='restaurant-url'
            onClick={(event) => confirmLeave(event)}
            href={processUrl(restaurant.url)}
            target='_blank'
            rel='noopener noreferrer'>
            <span>Website </span>
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
        </p>
        : <></>
      }
      <Button data-testid='randomizer-randomizeButton' onClick={changeRestaurantHandler} variant='success' size='lg'>
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
