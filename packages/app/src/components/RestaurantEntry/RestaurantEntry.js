import React, { useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from '@material-ui/icons'
import PropTypes from 'prop-types'
import { appName } from '../../config'
import MapModal from '../MapModal/MapModal'
import Comments from '../Comments/Comments'
import PhotoCarousel from '../Photos/PhotoCarousel'

import '../RestaurantEntry/RestaurantEntry.css'

const RestaurantEntry = ({ restaurant }) => {

  const [showMap, setShowMap] = useState(false)

  const confirmLeave = (event) => {
    if (!window.confirm(`This URL is user-submitted content that leads to an external website. 
    Are you sure you want to leave? URL: ${restaurant.url}`)) {
      event.preventDefault()
    }
  }

  const processUrl = (url) => {
    const hasPrefix = url.startsWith('https://') || url.startsWith('http://') || url.startsWith('//')
    return hasPrefix ? url : `//${url}`
  }

  const placeId = restaurant.placeId

  return (
    <div className='randomizer-resultContent'>
      <h1 data-testid='randomizer-resultLabel'>{restaurant.name}</h1>
      <p>
        {restaurant.url &&
          <a data-testid='randomizer-restaurantUrl'
            className='restaurant-url'
            onClick={(event) => confirmLeave(event)}
            href={processUrl(restaurant.url)}
            target='_blank'
            rel='noopener noreferrer'>
            <span>Website </span>
            <Link />
          </a>
        }
        <button data-testid='restaurantentry-showmap-button' onClick={() => setShowMap(!showMap)} className='restaurantentry-showmap-button'>
          {showMap ? 'Hide Directions' : 'Get Directions'}
        </button>
      </p>
      <div className="randomizer-resultDetails">
        {
          placeId && <PhotoCarousel placeId={placeId} />
        }
        {
          showMap && <MapModal restaurant={restaurant} showMap={showMap} setShowMap={setShowMap} />
        }
        {
          placeId && <Comments placeId={placeId} />
        }
      </div>
      {restaurant !== undefined && restaurant.resultAmount > 0 && <OverlayTrigger
        placement='right'
        overlay={
          <Tooltip >
            {restaurant.name + ' has won the lottery ' + restaurant.resultAmount + ' times. '
              + 'It was selected ' + restaurant.selectedAmount + ' times. '
              + '(Re-rolled ' + restaurant.notSelectedAmount + ' times)'}
          </Tooltip>
        } >
        <p className='randomizer-resultApproval'>
          {appName} users picked this restaurant {Math.round((restaurant.selectedAmount / restaurant.resultAmount * 100))}% of the time
        </p>
      </OverlayTrigger>
      }
    </div>
  )
}

RestaurantEntry.propTypes = {
  restaurant: PropTypes.object.isRequired,
  showMap: PropTypes.bool
}

export default RestaurantEntry
