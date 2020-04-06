import React from 'react'
import { actRender } from '../../test/utilities'
import MapModal from './MapModal'
import locationService from '../../services/location'


jest.mock('../../services/location.js')

locationService.getLeg.mockResolvedValue({
  duration: 1660,
  distance: 1956.084,
  legGeometry: { length: 114, points: 'o}fnJ{ofwCM?K@Q@e@Vk@pA?V@z@S@@j@@f@?BA@oBpAEJ…s@t@G?IHIHALeAfAAAGFEFEDGFIJ{AjBaB|Bw@hAw@lAU^Ym@' },
  from: { lat: 60.17, lon: 24.941944 },
  to: { lat: 60.182315, lon: 24.922893 }
})

const restaurant = {
  name: 'Luigi\'s pizza',
  url: 'www.pizza.fi',
  id: 1,
  distance: 1000,
  coordinates: { latitude: 60.17, longitude: 24.94 },
  placeId: 'ChIJxZrtjHj2jUYRUnc7prDjZaI'
}

test('mapModal renders the map when given a restaurant with coordinates', async () => {
  const { queryByTestId } = await actRender(<MapModal restaurant={restaurant} showMap={true} setShowMap={jest.fn()} />)
  const map = queryByTestId('map')
  expect(map).toBeInTheDocument()
})

test('mapModal renders an error when given a restaurant without coordinates', async () => {
  const brokenRestaurant = restaurant
  delete brokenRestaurant.coordinates
  const { queryByTestId } = await actRender(<MapModal restaurant={brokenRestaurant} showMap={true} setShowMap={jest.fn()} />)
  const map = queryByTestId('map')
  const errorMsg = queryByTestId('map-modal-error')
  expect(map).not.toBeInTheDocument()
  expect(errorMsg).toBeInTheDocument()
})
