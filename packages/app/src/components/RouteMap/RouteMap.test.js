import React from 'react'
import { actRender } from '../../test/utilities'
import locationService from '../../services/location'
import RouteMap from './RouteMap'

jest.mock('../../services/location.js')

locationService.getLeg.mockResolvedValue({
  duration: 1660,
  distance: 1956.084,
  legGeometry: { length: 114, points: 'o}fnJ{ofwCM?K@Q@e@Vk@pA?V@z@S@@j@@f@?BA@oBpAEJ…s@t@G?IHIHALeAfAAAGFEFEDGFIJ{AjBaB|Bw@hAw@lAU^Ym@' },
  from: { lat: 60.17, lon: 24.941944 },
  to: { lat: 60.182315, lon: 24.922893 }
})

const testRestaurant = {
  name: 'Nakkikiska',
  address: 'Jokukatu 420',
  coordinates: { latitude: 60.182315, longitude: 24.922893 },
  url: 'google.fi'
}

test('map component renders without crashing when provided with good props', async () => {
  const { getByTestId } = await actRender(
    <RouteMap restaurant={testRestaurant} />
  )
  let map = getByTestId('map')  
  expect(map).toBeInTheDocument()  
})
