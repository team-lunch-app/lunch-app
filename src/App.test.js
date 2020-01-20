import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import App from './App'
import { MemoryRouter } from 'react-router-dom'

test('randomizer exists initially', () => {
  const mockService = jest.fn()
  const { queryByTestId } = render(<MemoryRouter><App restaurantService={mockService} /></MemoryRouter>)
  const randomizer = queryByTestId('randomizer')
  expect(randomizer).toBeInTheDocument()
})

test('add form is hidden initially', () => {
  const { queryByTestId } = render(<MemoryRouter><App /></MemoryRouter>)
  const form = queryByTestId('addForm')
  expect(form).not.toBeInTheDocument()
})


test('addForm component is rendered when button is pressed', () => {
  const { queryByTestId } = render(<MemoryRouter><App /></MemoryRouter>)
  const button = queryByTestId('addForm-link')
  fireEvent.click(button)
  const form = queryByTestId('addForm')
  expect(form).toBeInTheDocument()
})
