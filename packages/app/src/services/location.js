import axios from 'axios'

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
          numItineraries: 3
        ) {
            itineraries {
                legs {
                    startTime
                    endTime
                    mode
                    trip {
                        routeShortName
                    }
                    duration
                    distance
                    from {
                        name
                        lat
                        lon
                        stop {
                            name
                        }
                    }
                    to {
                        name
                        lat
                        lon
                        stop {
                            name
                        }
                    }
                    legGeometry {
                        length
                        points
                    }
                }
            }
        }
    }`
  )
}

const getItineraries = async (lat, lon) => {
  const response = await axios.post(
    `${baseUrl}/routing/v1/routers/hsl/index/graphql`,
    createItineraryQuery(lat, lon),
    {
      headers: { 'Content-Type': 'application/graphql' },
    })
  const fetchedItineraries = response.data.data.plan.itineraries
  return fetchedItineraries
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

export default { getCoordinates, getDistance, getItineraries }
