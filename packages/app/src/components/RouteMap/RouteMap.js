import React, { useEffect, useState } from 'react'
import { Map, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import locationService from '../../services/location.js'
import PropTypes from 'prop-types'
import './RouteMap.css'

const RouteMap = ({ restaurant }) => {
  const [bounds, setBounds] = useState()
  const [start, setStart] = useState()
  const [end, setEnd] = useState()
  const [positions, setPositions] = useState()

  useEffect(() => {
    let mounted = true
    const getMapData = async () => {
      const leg = await locationService.getLeg(restaurant.coordinates.latitude, restaurant.coordinates.longitude)
      if (mounted) {
        setStart([locationService.unityLat, locationService.unityLon])
        setEnd([restaurant.coordinates.latitude, restaurant.coordinates.longitude])
        setBounds(locationService.calculateBounds(leg))
        setPositions(locationService.decodeRoute(leg.legGeometry.points))
      }
    }
    getMapData()
    return () => mounted = false
  }, [restaurant])

  return (
    <div data-testid='map'>
      <Map
        bounds={bounds}
        boundsOptions={{ padding: [10, 10] }}
        maxZoom={18}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
        tileSize={512}
        zoomOffset={-1}
        zoom={14}
      >
        <TileLayer
          data-testid='map-tilelayer'
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://cdn.digitransit.fi/map/v1/hsl-map/{z}/{x}/{y}.png"
        />
        {(start && end) &&
          <>
            <Marker data-testid='map-marker-start' position={start}>
              <Popup>
                Unity Offices
              </Popup>
            </Marker>
            <Marker data-testid='map-marker-end' position={end}>
              <Popup>
                {restaurant.name}
              </Popup>
            </Marker>
          </>
        }
        {positions &&
          <Polyline
            data-testid='map-polyline'
            dashArray="5"
            positions={positions} />
        }
      </Map>
    </div>
  )
}

RouteMap.propTypes = {
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
  })
}

export default RouteMap
