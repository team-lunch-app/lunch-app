import React from 'react'
import { fireEvent, within } from '@testing-library/react'
import DistanceFilter from './DistanceFilter'
import { actRender } from '../../../test/utilities'

test('distance field renders', async () => {
  const mockSetDistance = jest.fn()
  const distance = 500
  const { queryByTestId } =
    await actRender(
      <DistanceFilter distance={distance} setDistance={mockSetDistance} />
    )
  const distancefilter = queryByTestId('distance-field')
  expect(distancefilter).toBeInTheDocument()
})

test('distance field renders the distance value', async () => {
  const mockSetDistance = jest.fn()
  const distance = 500
  const { getByTestId } =
    await actRender(
      <DistanceFilter distance={distance} setDistance={mockSetDistance} />
    )

  const form = getByTestId(/distance-form/i)
  const distanceField = within(form).getByTestId(/distance-field/i)
  // Input test data
  const distanceElement = within(distanceField).getByRole(/textbox/i)
  expect(distanceElement.value).toBe(''+distance)
})

test('distance field calls setDistance with the correct arguments', async () => {
  const mockSetDistance = jest.fn()
  const distance = 500
  const newDistance = 50000
  const { getByTestId } =
    await actRender(
      <DistanceFilter distance={distance} setDistance={mockSetDistance} />
    )

  const form = getByTestId(/distance-form/i)
  const distanceField = within(form).getByTestId(/distance-field/i)
  // Input test data
  const distanceElement = within(distanceField).getByRole(/textbox/i)
  fireEvent.change(distanceElement, { target: { value: newDistance } })
  expect(mockSetDistance).toBeCalledWith(''+newDistance)
})

