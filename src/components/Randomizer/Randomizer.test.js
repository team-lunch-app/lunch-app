import React from 'react'
import { fireEvent, waitForDomChange } from '@testing-library/react'
import { actRender } from '../../test/utilities'
import Randomizer from './Randomizer'
import restaurantService from '../../services/restaurant'
import categoryService from '../../services/category'

jest.mock('../../services/restaurant.js')
restaurantService.getRandom.mockResolvedValue({
  name: 'Luigi\'s pizza',
  url: 'www.pizza.fi',
  id: 1
})

jest.mock('../../services/category.js')
categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])


test('new restaurant button exists', async () => {
  const { queryByTestId } = await actRender(<Randomizer />)
  const buttonElement = queryByTestId('randomizer-randomizeButton')
  expect(buttonElement).toBeInTheDocument()
})

test('restaurant result label exists', async () => {
  const { queryByTestId } = await actRender(<Randomizer />)
  const labelElement = queryByTestId('randomizer-resultLabel')
  expect(labelElement).toBeInTheDocument()
})

test('restaurant result label is not empty initially', async () => {
  const { queryByTestId } = await actRender(<Randomizer />)
  const labelElement = queryByTestId('randomizer-resultLabel')
  expect(labelElement).not.toBeEmpty()
})

test('restaurant url is not rendered initially (no restaurant is shown)', async () => {
  const { queryByTestId } = await actRender(<Randomizer />)
  const url = queryByTestId('randomizer-restaurantUrl')
  expect(url).not.toBeInTheDocument()
})

test('restaurant url is rendered after a restaurant is drawn', async () => {
  const { queryByTestId, getByTestId } = await actRender(<Randomizer />)

  fireEvent.click(queryByTestId('randomizer-randomizeButton'))
  await waitForDomChange()

  const url = getByTestId('randomizer-restaurantUrl')
  expect(url).toBeInTheDocument()
})

test('pressing the button calls the restaurant service', async () => {
  const { queryByTestId } = await actRender(<Randomizer />)
  const buttonElement = queryByTestId('randomizer-randomizeButton')

  fireEvent.click(buttonElement)
  await waitForDomChange()

  expect(restaurantService.getRandom).toBeCalled()
})

test('pressing the button changes the text', async () => {
  const { queryByTestId } = await actRender(<Randomizer />)

  const restaurantNameElement = queryByTestId('randomizer-resultLabel')
  const originalText = restaurantNameElement.textContent

  fireEvent.click(queryByTestId('randomizer-randomizeButton'))
  await waitForDomChange()

  expect(restaurantNameElement.textContent).not.toBe(originalText)
})

test('user is not redirected to an external website if not confirmed', async () => {
  const { queryByTestId } = await actRender(<Randomizer />)

  // Generate a restaurant suggestion
  fireEvent.click(queryByTestId('randomizer-randomizeButton'))
  await waitForDomChange()

  const url = queryByTestId('randomizer-restaurantUrl')
  window.confirm = jest.fn(() => false)
  fireEvent.click(url)

  expect(url).toBeInTheDocument()
})
