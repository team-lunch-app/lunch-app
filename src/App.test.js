import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import App from './App'

test('randomizer exists', () => {
  const mockService = jest.fn()
  const { queryByTestId } = render(<App restaurantService={mockService} />)
  const randomizer = queryByTestId('randomizer')
  expect(randomizer).toBeInTheDocument()
})
