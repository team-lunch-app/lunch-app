import React from 'react'
import { render, fireEvent, waitForElement, waitForElementToBeRemoved } from '@testing-library/react'
import restaurantService from '../services/restaurant'
import App from '../App'
import RestaurantList from './RestaurantList'
import { MemoryRouter } from 'react-router-dom'
import { fail } from 'assert'

jest.mock('../services/restaurant.js')

beforeEach(() => {
  restaurantService.getAll.mockResolvedValue(
    [
      {
        name: "Luigi's pizza",
        url: "www.pizza.fi",
        id: 1
      },
      {
        name: "Pizzeria Rax",
        url: "www.rax.fi",
        id: 2
      },
      {
        name: "Ravintola Artjärvi",
        url: "www.bestfood.fi",
        id: 3
      }
    ]
  )
})

test('page title is rendered', async () => {
  const { queryByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={['/restaurants']}>
      <RestaurantList restaurantService={restaurantService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('restaurantList-loading'))

  const title = await queryByTestId('restaurantList-title')
  expect(title).toBeInTheDocument()
})

test('back button is rendered', async () => {
  const { queryByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={['/restaurants']}>
      <RestaurantList restaurantService={restaurantService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('restaurantList-loading'))

  const backButton = await queryByTestId('restaurantList-backButton')
  expect(backButton).toBeInTheDocument()
})

test('back button returns to the home page', async () => {
  const { queryByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={['/restaurants']}>
      <App restaurantService={restaurantService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('restaurantList-loading'))

  // Press the back button
  const buttonElement = queryByTestId('restaurantList-backButton')
  fireEvent.click(buttonElement)

  await waitForElement(() => getByTestId('randomizer'), { timeout: 250 })

  const restaurantList = queryByTestId('restaurantList')
  expect(restaurantList).not.toBeInTheDocument()
})

test('informative message is rendered if no restaurants exist', async () => {
  restaurantService.getAll.mockResolvedValue([])

  const { queryByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={['/restaurants']}>
      <RestaurantList restaurantService={restaurantService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('restaurantList-loading'))

  const message = await queryByTestId('restaurantList-alertMessage')
  expect(message).toBeInTheDocument()
})

test('a restaurant is rendered if one exists', async () => {
  restaurantService.getAll.mockResolvedValue([{
    name: "Luigi's pizza",
    url: "www.pizza.fi",
    id: 1
  }])

  const { queryByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={['/restaurants']}>
      <RestaurantList restaurantService={restaurantService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('restaurantList-loading'))

  const restaurant = await queryByTestId('restaurantList-restaurantEntry')
  expect(restaurant).toBeInTheDocument()
})

test('multiple restaurants are rendered if more than one exist', async () => {
  const { queryAllByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={['/restaurants']}>
      <RestaurantList restaurantService={restaurantService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('restaurantList-loading'))

  const restaurants = await queryAllByTestId('restaurantList-restaurantEntry')
  expect(restaurants.length).toBeGreaterThan(1)
})

test('pressing the delete button calls the service to remove the restaurant', async () => {
  restaurantService.getAll.mockResolvedValue([{
    name: "Luigi's pizza",
    url: "www.pizza.fi",
    id: 13
  }])

  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/restaurants']}>
      <RestaurantList restaurantService={restaurantService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('restaurantList-loading'))

  const removeButton = getByTestId('restaurantEntry-removeButton')
  fireEvent.click(removeButton)
  expect(restaurantService.remove).toBeCalledWith(13)
})
