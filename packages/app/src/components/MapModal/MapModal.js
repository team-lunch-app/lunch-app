import React from 'react'
import { Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import RouteMap from '../RouteMap/RouteMap'

import './MapModal.css'

const MapModal = ({ restaurant, showMap, setShowMap }) => {

  return (
    <Modal data-testid='map-modal' show={showMap} onHide={() => setShowMap(false)} animation={false}>
      <Modal.Header data-testid='modal-header' closeButton>
        Directions to {restaurant.name}
      </Modal.Header>
      <Modal.Body className="map-modal-body">
        {restaurant.coordinates
          ? <RouteMap restaurant={restaurant} />
          : <div data-testid="map-modal-error" className="map-modal-error">
            <span>
              This restaurant has not been given an address. Please use the &nbsp; 
            </span>
            <Link to={`/edit/${restaurant.id}`}>
              editing page
            </Link>
            <span>
            &nbsp; to add the address to this restaurant.
            </span>
          </div>
        }
      </Modal.Body>
    </Modal >
  )
}

MapModal.propTypes = {
  restaurant: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    categories: PropTypes.array,
    address: PropTypes.string,
    coordinates: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired
    })
  }),
  showMap: PropTypes.bool.isRequired,
  setShowMap: PropTypes.func.isRequired
}

export default MapModal
