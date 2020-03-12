import React from 'react'
import { within, fireEvent } from '@testing-library/react'
import AddForm from './AddForm'

import categoryService from '../../services/category'
import locationService from '../../services/location'

import { actRender } from '../../test/utilities'
import { act } from 'react-dom/test-utils'

jest.mock('../../services/category.js')
jest.mock('../../services/location.js')

beforeEach(() => {
  jest.clearAllMocks()
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])
  locationService.getCoordinates.mockResolvedValue({ latitude: 69, longitude: 42 })
  locationService.getDistance.mockResolvedValue(1234)
  locationService.getLeg.mockResolvedValue({
    duration: 1660,
    distance: 1956.084,
    legGeometry: { length: 114, points: 'o}fnJ{ofwCM?K@Q@e@Vk@pA?V@z@S@@j@@f@?BA@oBpAEJ…s@t@G?IHIHALeAfAAAGFEFEDGFIJ{AjBaB|Bw@hAw@lAU^Ym@' },
    from: { lat: 60.17, lon: 24.941944 },
    to: { lat: 60.182315, lon: 24.922893 }
  })
})

test('map is not shown by default in the add form', async () => {
  const { queryByTestId } = await actRender(<AddForm />)
  expect(queryByTestId('map')).not.toBeInTheDocument()
})

test('map is shown if the address is changed and checked', async () => {
  const { queryByTestId, getByTestId } = await actRender(<AddForm />)
  const form = getByTestId(/restaurant-form/i)
  const addressField = within(form).getByTestId(/address-field/i)
  const addressElement = within(addressField).getByRole(/textbox/i)
  fireEvent.change(addressElement, { target: { value: 'Joku toinen katu 24' } })
  const checkButton = within(form).getByTestId(/check-button/i)
  await act(async () => fireEvent.click(checkButton))
  expect(queryByTestId('map')).toBeInTheDocument()
})

test('map is not shown if the address is changed after checking it', async () => {
  const { queryByTestId, getByTestId } = await actRender(<AddForm />)
  const form = getByTestId(/restaurant-form/i)
  const addressField = within(form).getByTestId(/address-field/i)
  const addressElement = within(addressField).getByRole(/textbox/i)
  fireEvent.change(addressElement, { target: { value: 'Joku toinen katu 24' } })
  const checkButton = within(form).getByTestId(/check-button/i)
  await act(async () => fireEvent.click(checkButton))
  fireEvent.change(addressElement, { target: { value: 'Joku kolmas katu 1 a 82' } })
  expect(queryByTestId('map')).not.toBeInTheDocument()
})
