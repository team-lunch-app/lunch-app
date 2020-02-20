import React from 'react'
import { fireEvent } from '@testing-library/react'
import restaurantService from '../../../services/restaurant'
import categoryService from '../../../services/category'
import RestaurantList from './RestaurantList'

import { actRender } from '../../../test/utilities'

jest.mock('../../../services/restaurant.js')
jest.mock('../../../services/category.js')

beforeEach(() => {
  jest.clearAllMocks()
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])
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
})

test('page title is rendered', async () => {
  const { queryByTestId } = await actRender(<RestaurantList />, ['/restaurants'])
  const title = await queryByTestId('restaurantList-title')
  expect(title).toBeInTheDocument()
})

test('back button is rendered', async () => {
  const { queryByTestId } = await actRender(<RestaurantList />, ['/restaurants'])
  const backButton = await queryByTestId('restaurantList-backButton')
  expect(backButton).toBeInTheDocument()
})

test('back button returns to the home page', async () => {
  const { queryByTestId, getPath } = await actRender(<RestaurantList />, ['/restaurants'])

  // Press the back button
  const buttonElement = queryByTestId('restaurantList-backButton')
  fireEvent.click(buttonElement)

  expect(getPath().pathname).toBe('/')
})

test('informative message is rendered if no restaurants exist', async () => {
  restaurantService.getAll.mockResolvedValue([])

  const { queryByTestId } = await actRender(<RestaurantList />, ['/restaurants'])
  const message = await queryByTestId('restaurantList-alertMessage')
  expect(message).toBeInTheDocument()
})

test('a restaurant is rendered if one exists', async () => {
  restaurantService.getAll.mockResolvedValue([{
    name: 'Luigi\'s pizza',
    url: 'www.pizza.fi',
    id: 1
  }])

  const { queryByTestId } = await actRender(<RestaurantList />, ['/restaurants'])
  const restaurant = await queryByTestId('restaurantList-restaurantEntry')
  expect(restaurant).toBeInTheDocument()
})

test('multiple restaurants are rendered if more than one exist', async () => {
  const { queryAllByTestId } = await actRender(<RestaurantList />, ['/restaurants'])
  const restaurants = await queryAllByTestId('restaurantList-restaurantEntry')
  expect(restaurants.length).toBeGreaterThan(1)
})

test('pressing the delete button calls the service to remove the restaurant if OK is pressed', async () => {
  restaurantService.getAll.mockResolvedValue([{
    name: 'Luigi\'s pizza',
    url: 'www.pizza.fi',
    id: 13
  }])

  window.confirm = jest.fn(() => true)

  const { queryByTestId } = await actRender(<RestaurantList />, ['/restaurants'])
  const removeButton = queryByTestId('restaurantEntry-removeButton')
  fireEvent.click(removeButton)
  expect(restaurantService.remove).toBeCalledWith(13)
})

test('pressing the delete button does not attempt to remove the restaurant if cancel is pressed', async () => {
  restaurantService.getAll.mockResolvedValue([{
    name: 'Luigi\'s pizza',
    url: 'www.pizza.fi',
    id: 13
  }])

  window.confirm = jest.fn(() => false)

  const { queryByTestId } = await actRender(<RestaurantList />, ['/restaurants'])
  const removeButton = queryByTestId('restaurantEntry-removeButton')
  fireEvent.click(removeButton)
  expect(restaurantService.remove).not.toBeCalled()
})
