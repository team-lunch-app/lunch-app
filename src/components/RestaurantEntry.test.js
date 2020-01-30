import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import RestaurantEntry from './RestaurantEntry'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../services/restaurant.js')

const testRestaurant = {
  name: 'Luigi\'s pizza',
  url: 'www.pizza.fi',
  id: 13
}

test('renders restaurant name', async () => {
  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/restaurants']}>
      <RestaurantEntry restaurant={testRestaurant} />
    </MemoryRouter>
  )

  const restaurantName = getByTestId('restaurantEntry-name')
  expect(restaurantName).toBeInTheDocument()
})

test('renders delete button', async () => {
  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/restaurants']}>
      <RestaurantEntry restaurant={testRestaurant} />
    </MemoryRouter>
  )

  const removeButton = getByTestId('restaurantEntry-removeButton')
  expect(removeButton).toBeInTheDocument()
})

test('pressing the delete button calls the provided callback', async () => {
  const mockOnRemove = jest.fn()
  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/restaurants']}>
      <RestaurantEntry restaurant={testRestaurant} onRemove={mockOnRemove} />
    </MemoryRouter>
  )

  const removeButton = getByTestId('restaurantEntry-removeButton')
  fireEvent.click(removeButton)
  expect(mockOnRemove).toBeCalledWith(testRestaurant)
})

test('renders edit button', async () => {
  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/restaurants']}>
      <RestaurantEntry restaurant={testRestaurant} />
    </MemoryRouter>
  )

  const editButton = getByTestId('restaurantEntry-editButton')
  expect(editButton).toBeInTheDocument()
})
