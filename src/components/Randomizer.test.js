import React from 'react'
import { render, fireEvent, waitForDomChange } from '@testing-library/react'
import Randomizer from './Randomizer'
import restaurantService from '../services/restaurant'

jest.mock('../services/restaurant.js')
restaurantService.getAll.mockResolvedValue(
  [
    {
      name: 'Luigi\'s pizza',
      url: 'www.pizza.fi',
      id: 1
    },
    {
      name: 'Pizzeria Rax',
      url: 'www.rax.fi',
      id: 2
    },
    {
      name: 'Ravintola Artjärvi',
      url: 'www.bestfood.fi',
      id: 3
    }
  ]
)

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

test('restaurant url is not rendered initially (no restaurant is shown)', () => {
  const { queryByTestId } = render(<Randomizer restaurantService={restaurantService} />)
  const url = queryByTestId('randomizer-restaurantUrl')
  expect(url).not.toBeInTheDocument()
})

test('restaurant url is rendered after a restaurant is drawn', async  () => {
  const { queryByTestId } = render(<Randomizer restaurantService={restaurantService} />)

  fireEvent.click(queryByTestId('randomizer-randomizeButton'))
  await waitForDomChange()

  const url = queryByTestId('randomizer-restaurantUrl')
  expect(url).toBeInTheDocument()
})

test('pressing the button calls the restaurant service', async () => {
  const { queryByTestId } = render(<Randomizer restaurantService={restaurantService} />)
  const buttonElement = queryByTestId('randomizer-randomizeButton')

  fireEvent.click(buttonElement)
  await waitForDomChange()

  expect(restaurantService.getAll).toBeCalled()
})

test('pressing the button changes the text', async () => {
  const { queryByTestId } = render(<Randomizer restaurantService={restaurantService} />)
  const restaurantNameElement = queryByTestId('randomizer-resultLabel')
  const originalText = restaurantNameElement.textContent

  fireEvent.click(queryByTestId('randomizer-randomizeButton'))
  await waitForDomChange()

  expect(restaurantNameElement.textContent).not.toBe(originalText)
})
