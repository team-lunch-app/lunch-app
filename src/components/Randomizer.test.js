import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Randomizer from './Randomizer'

test('new restaurant button exists', () => {
  const mockService = jest.fn()
  const { queryByTestId } = render(<Randomizer restaurantService={mockService} />)
  const buttonElement = queryByTestId('randomizer-randomizeButton')
  expect(buttonElement).toBeInTheDocument()
})

test('restaurant result label exists', () => {
  const mockService = jest.fn()
  const { queryByTestId } = render(<Randomizer restaurantService={mockService} />)
  const labelElement = queryByTestId('randomizer-resultLabel')
  expect(labelElement).toBeInTheDocument()
})

test('pressing the button calls the restaurant service', () => {
  const mockService = jest.fn()
  const { queryByTestId } = render(<Randomizer restaurantService={mockService} />)
  const buttonElement = queryByTestId('randomizer-randomizeButton')

  fireEvent.click(buttonElement)
  expect(mockService.getAll()).toBeCalled()
})

test('pressing the button changes the text', () => {
  const mockService = jest.fn()
  const { queryByTestId } = render(<Randomizer restaurantService={mockService} />)
  const restaurantNameElement = queryByTestId('randomizer-resultLabel')
  const originalText = restaurantNameElement.textContent

  fireEvent.click(queryByTestId('randomizer-randomizeButton'))
  expect(restaurantNameElement.textContent).not.toBe(originalText)
})

