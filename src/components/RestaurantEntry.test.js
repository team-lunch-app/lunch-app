import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import RestaurantEntry from './RestaurantEntry'

jest.mock('../services/restaurant.js')

const testRestaurant = {
  name: 'Luigi\'s pizza',
  url: 'www.pizza.fi',
  id: 13
}

test('renders restaurant name', async () => {
  const { getByTestId } = render(<RestaurantEntry restaurant={testRestaurant} />)

  const restaurantName = getByTestId('restaurantEntry-name')
  expect(restaurantName).toBeInTheDocument()
})

test('renders delete button', async () => {
  const { getByTestId } = render(<RestaurantEntry restaurant={testRestaurant} />)

  const removeButton = getByTestId('restaurantEntry-removeButton')
  expect(removeButton).toBeInTheDocument()
})

test('pressing the delete button calls the provided callback', async () => {
  const mockOnRemove = jest.fn()
  const { getByTestId } = render(<RestaurantEntry restaurant={testRestaurant} onRemove={mockOnRemove} />)

  const removeButton = getByTestId('restaurantEntry-removeButton')
  fireEvent.click(removeButton)
  expect(mockOnRemove).toBeCalledWith(testRestaurant)
})
