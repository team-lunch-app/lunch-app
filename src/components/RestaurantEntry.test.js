import React from 'react'
import { fireEvent } from '@testing-library/react'
import RestaurantEntry from './RestaurantEntry'

import { actRender } from '../test/utilities'

jest.mock('../services/restaurant.js')

const testRestaurant = {
  name: 'Luigi\'s pizza',
  url: 'www.pizza.fi',
  id: 13
}

test('renders restaurant name', async () => {
  const { getByTestId } = await actRender(<RestaurantEntry restaurant={testRestaurant} />, ['/restaurants'])
  const restaurantName = getByTestId('restaurantEntry-name')
  expect(restaurantName).toBeInTheDocument()
})

test('renders delete button', async () => {
  const { getByTestId } = await actRender(<RestaurantEntry restaurant={testRestaurant} />, ['/restaurants'])
  const removeButton = getByTestId('restaurantEntry-removeButton')
  expect(removeButton).toBeInTheDocument()
})

test('pressing the delete button calls the provided callback', async () => {
  const mockOnRemove = jest.fn()
  const { getByTestId } = await actRender(
    <RestaurantEntry restaurant={testRestaurant} onRemove={mockOnRemove} />,
    ['/restaurants']
  )

  const removeButton = getByTestId('restaurantEntry-removeButton')
  fireEvent.click(removeButton)
  expect(mockOnRemove).toBeCalledWith(testRestaurant)
})

test('renders edit button', async () => {
  const { getByTestId } = await actRender(<RestaurantEntry restaurant={testRestaurant} />, ['/restaurants'])

  const editButton = getByTestId('restaurantEntry-editButton')
  expect(editButton).toBeInTheDocument()
})

test('clicking the edit button navigates to the edit page', async () => {
  const { getByTestId, getPath } = await actRender(<RestaurantEntry restaurant={testRestaurant} />, ['/restaurants'])

  const editButton = getByTestId('restaurantEntry-editButton')
  fireEvent.click(editButton)
  expect(getPath().pathname).toBe(`/edit/${testRestaurant.id}`)
})
