import React from 'react'
import { Link } from '@material-ui/icons'
import PropTypes from 'prop-types'
import RouteMap from '../RouteMap/RouteMap'
import Comments from '../Comments/Comments'

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

  // Comments tarvitsee restaurant.place_id:n
  //restaurant.place_id = 'abc123'

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
        showMap && <RouteMap restaurant={restaurant} />
      }
      {
        restaurant.showMap && <Comments place_id={'abc123'}/>
      }

    </>

  )
}

RestaurantEntry.propTypes = {
  restaurant: PropTypes.object.isRequired,
  showMap: PropTypes.bool
}

export default RestaurantEntry
