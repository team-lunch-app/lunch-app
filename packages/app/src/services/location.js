import axios from 'axios'
import poly from '@mapbox/polyline'

const unityLat = 60.170000
const unityLon = 24.941944
const baseUrl = 'https://api.digitransit.fi'
const maxDistance = 50

const createDistanceQuery = (targetLat, targetLon) => {
  return (`
    {
        plan(
            from: { lat: ${unityLat}, lon: ${unityLon} }
            to: { lat: ${targetLat}, lon: ${targetLon} }
          numItineraries: 1
          transportModes: [{mode: WALK}]
        ) {
            itineraries {
                legs {
                    distance
                }
            }
        }
    }`
  )
}

const createItineraryQuery = (targetLat, targetLon) => {
  return (`
    {
        plan(
            from: { lat: ${unityLat}, lon: ${unityLon} }
          to: { lat: ${targetLat}, lon: ${targetLon} }
          numItineraries: 1
          transportModes: [{mode: WALK}]
        ) {
            itineraries {
                legs {
                    duration
                    distance
                    legGeometry {
                        length
                        points
                    }
                    from {
                        lat
                        lon
                    }
                    to {
                        lat
                        lon
                    }
                }
            }
        }
    }`
  )
}

const getLeg = async (lat, lon) => {
  const response = await axios.post(
    `${baseUrl}/routing/v1/routers/hsl/index/graphql`,
    createItineraryQuery(lat, lon),
    {
      headers: { 'Content-Type': 'application/graphql' },
    })
  const fetchedItinerary = response.data.data.plan.itineraries[0]
  const leg = fetchedItinerary.legs[0]
  return leg
}

const getDistance = async (lat, lon) => {
  const response = await axios.post(
    `${baseUrl}/routing/v1/routers/hsl/index/graphql`,
    createDistanceQuery(lat, lon),
    {
      headers: { 'Content-Type': 'application/graphql' },
    })
  const fetchedItineraries = response.data.data.plan.itineraries
  const distance = fetchedItineraries[0].legs.map(leg => leg.distance).reduce((total, singleLeg) => total + singleLeg)
  return distance
}

const getCoordinates = async (text) => {
  const response = await axios.get(`${baseUrl}/geocoding/v1/search?text=${text}&boundary.circle.lat=${unityLat}&boundary.circle.lon=${unityLon}&boundary.circle.radius=${maxDistance}`)
  const coordinates = response.data.features[0].geometry.coordinates
  return { latitude: coordinates[1], longitude: coordinates[0] }
}

const decodeRoute = (legGeometry) => {
  return poly.decode(legGeometry)
}

const calculateBounds = (leg) => {
  return [
    [Math.max(leg.from.lat, leg.to.lat), Math.min(leg.from.lon, leg.to.lon)],
    [Math.min(leg.from.lat, leg.to.lat), Math.max(leg.from.lon, leg.to.lon)]
  ]
}

export default { getCoordinates, getDistance, getLeg, decodeRoute, calculateBounds, unityLat, unityLon }
