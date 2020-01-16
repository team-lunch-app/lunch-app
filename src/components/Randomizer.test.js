import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Randomizer from './Randomizer'
import restaurantService from '../services/restaurant_stub'

jest.mock('../services/restaurant_stub.js')

test('new restaurant button exists', () => {
  const { queryByTestId } = render(<Randomizer restaurantService={restaurantService} />)
  const buttonElement = queryByTestId('randomizer-randomizeButton')
  expect(buttonElement).toBeInTheDocument()
})

test('restaurant result label exists', () => {
  const { queryByTestId } = render(<Randomizer restaurantService={restaurantService} />)
  const labelElement = queryByTestId('randomizer-resultLabel')
  expect(labelElement).toBeInTheDocument()
})

test('pressing the button calls the restaurant service', () => {
  const { queryByTestId } = render(<Randomizer restaurantService={restaurantService} />)
  const buttonElement = queryByTestId('randomizer-randomizeButton')

  fireEvent.click(buttonElement)
  expect(restaurantService.getAll).toBeCalled()
})

test('pressing the button changes the text', () => {
  const { queryByTestId } = render(<Randomizer restaurantService={restaurantService} />)
  const restaurantNameElement = queryByTestId('randomizer-resultLabel')
  const originalText = restaurantNameElement.textContent

  fireEvent.click(queryByTestId('randomizer-randomizeButton'))
  expect(restaurantNameElement.textContent).not.toBe(originalText)
})

