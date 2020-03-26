import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from '@material-ui/icons'
import PropTypes from 'prop-types'
import RouteMap from '../RouteMap/RouteMap'
import Comments from '../Comments/Comments'
import PhotoCarousel from '../Photos/PhotoCarousel'

import '../RestaurantEntry/RestaurantEntry.css'

const RestaurantEntry = ({ restaurant, showMap }) => {

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
    <>
      <h1 data-testid='randomizer-resultLabel'>{restaurant.name}</h1>
      {restaurant.url &&
        <p>
          <a data-testid='randomizer-restaurantUrl'
            className='restaurant-url'
            onClick={(event) => confirmLeave(event)}
            href={processUrl(restaurant.url)}
            target='_blank'
            rel='noopener noreferrer'>
            <span>Website </span>
            <Link />
          </a>
        </p>
      }
      {
        showMap && <PhotoCarousel placeId={placeId} />
      }
      {
        showMap && <RouteMap restaurant={restaurant} />
      }
      {
        showMap && <Comments placeId={placeId} />
      }
      {restaurant !== undefined && restaurant.notSelectedAmount > 0 && <OverlayTrigger
        placement='right'
        overlay={
          <Tooltip >
            {restaurant.name + ' has won the lottery ' + restaurant.resultAmount + ' times. ' + restaurant.name + ' was not chosen ' + restaurant.notSelectedAmount + ' times.'}
          </Tooltip>
        } >
        <p className='randomizer-resultApproval'>Lunch Lottery users approved this restaurant {Math.round((restaurant.resultAmount - restaurant.notSelectedAmount) / restaurant.resultAmount * 100)}% of the time</p>
      </OverlayTrigger>
      }
    </>
  )
}

RestaurantEntry.propTypes = {
  restaurant: PropTypes.object.isRequired,
  showMap: PropTypes.bool
}

export default RestaurantEntry
