import React, { useState } from 'react'
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap'
import { Link, MapOutlined } from '@material-ui/icons'
import PropTypes from 'prop-types'
import { appName } from '../../config'
import MapModal from '../MapModal/MapModal'
import Comments from '../Comments/Comments'
import PhotoCarousel from '../Photos/PhotoCarousel'

import '../RestaurantEntry/RestaurantEntry.css'

const RestaurantEntry = ({ restaurant, hidden }) => {

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
    <div className='randomizer-resultContent' style={{display: (hidden ? 'none' : 'flex')}}>
      <h1 data-testid='randomizer-resultLabel'>{restaurant.name}</h1>
      <p>
        {restaurant.url &&
        <Button
          data-testid='randomizer-restaurantUrl'
          className='link-button'
          variant='info'
          onClick={(event) => confirmLeave(event)}
          href={processUrl(restaurant.url)}
          target='_blank'
          rel='noopener noreferrer'>
          <span>Website </span>
          <Link />
        </Button>
        }
        <Button data-testid='restaurantentry-showmap-button' variant='info' onClick={() => setShowMap(!showMap)} className='link-button'>
          {showMap ? 'Hide Directions ' : 'Get Directions '}
          <MapOutlined fontSize='small' />
        </Button>
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
            {'* ' + restaurant.name + ' has been selected ' + restaurant.selectedAmount + ' times. '
              + 'It has been re-rolled ' + restaurant.notSelectedAmount + ' times. '
              + '(Total number of times as the lottery result: ' + restaurant.resultAmount + ')'
            } 
          </Tooltip>
        } >
        <p className='randomizer-resultApproval'>
          {appName} users picked this restaurant {Math.round((restaurant.selectedAmount / restaurant.notSelectedAmount * 100))}% of the time &#42;
        </p>
      </OverlayTrigger>
      }
    </div>
  )
}

RestaurantEntry.propTypes = {
  restaurant: PropTypes.object.isRequired,
  showMap: PropTypes.bool,
  hidden: PropTypes.bool
}

export default RestaurantEntry
