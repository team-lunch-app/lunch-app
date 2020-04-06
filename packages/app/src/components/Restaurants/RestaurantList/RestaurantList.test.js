import React from 'react'
import { fireEvent, within, wait, getByText } from '@testing-library/react'
import restaurantService from '../../../services/restaurant'
import categoryService from '../../../services/category'
import authService from '../../../services/authentication'

import RestaurantList from './RestaurantList'

import { actRender } from '../../../test/utilities'

jest.mock('../../../services/restaurant.js')
jest.mock('../../../services/category.js')
jest.mock('../../../services/suggestion.js')
jest.mock('../../../services/authentication.js')

beforeEach(() => {
  jest.clearAllMocks()
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])
  restaurantService.getAll.mockResolvedValue(
    [
      {
        name: 'Luigi\'s pizza',
        url: 'www.pizza.fi',
        id: 1,
        categories: [
          {
          name: 'pizza'
        },
        ]
      },
      {
        name: 'Pizzeria Rax',
        url: 'www.rax.fi',
        id: 2,
        categories: [
          {
            name: 'pizza'
          },
        ]
      },
      {
        name: 'Ravintola Artjärvi',
        url: 'www.bestfood.fi',
        id: 3,
        categories: [
          {
            name: 'pizza'
          },
        ]
      }
    ]
  )
})

test('page title is rendered', async () => {
  const { queryByTestId } = await actRender(<RestaurantList />, ['/restaurants'])
  const title = await queryByTestId('restaurantList-title')
  expect(title).toBeInTheDocument()
})

test('pressing the delete button calls the service to remove the restaurant if OK is pressed', async () => {
  authService.getToken.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNDUzYmFlNjZiYjNkMjUxZGMwM2U5YyIsInVzZXJuYW1lIjoiTWFrZSIsImlhdCI6MTU4MTU5OTg5MX0.0BDsns4hxWvMguZq8llaB3gMTvPNDkDhPkl7mCYl928')

  restaurantService.getAll.mockResolvedValue([{
    name: 'Luigi\'s pizza',
    url: 'www.pizza.fi',
    id: 13,
    categories: []
  }])

  window.confirm = jest.fn(() => true)

  const { getByTestId } = await actRender(<RestaurantList />, ['/restaurants'])

  const entry = within(getByTestId('list')).getByTestId('list-entry')
  const removeButton = within(entry).getByRole('remove-button')
  fireEvent.click(removeButton)
  expect(restaurantService.remove).toBeCalledWith(13)
})

test('pressing the delete button does not attempt to remove the restaurant if cancel is pressed', async () => {
  authService.getToken.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNDUzYmFlNjZiYjNkMjUxZGMwM2U5YyIsInVzZXJuYW1lIjoiTWFrZSIsImlhdCI6MTU4MTU5OTg5MX0.0BDsns4hxWvMguZq8llaB3gMTvPNDkDhPkl7mCYl928')

  restaurantService.getAll.mockResolvedValue([{
    name: 'Luigi\'s pizza',
    url: 'www.pizza.fi',
    id: 13,
    categories: []
  }])

  window.confirm = jest.fn(() => false)

  const { getByTestId } = await actRender(<RestaurantList />, ['/restaurants'])

  const entry = within(getByTestId('list')).getByTestId('list-entry')
  const removeButton = within(entry).getByRole('remove-button')
  fireEvent.click(removeButton)
  expect(restaurantService.remove).not.toBeCalled()
})

test('pressing the edit button redirects to edit page', async () => {
  restaurantService.getAll.mockResolvedValue([{
    name: 'Luigi\'s pizza',
    url: 'www.pizza.fi',
    id: 13,
    categories: []
  }])

  const { getByTestId, getPath } = await actRender(<RestaurantList />, ['/restaurants'])

  const entry = within(getByTestId('list')).getByTestId('list-entry')
  const removeButton = within(entry).getByRole('edit-button')
  fireEvent.click(removeButton)
  await wait(() => expect(getPath().pathname).toBe('/edit/13'), { timeout: 500 })
})

test('search field renders', async () => {
  const { queryByTestId } = await actRender(<RestaurantList />, ['/restaurants'])
  const field = await queryByTestId('search-field')
  expect(field).toBeInTheDocument()
})

test('text can be entered to the search field', async () => {
  const { queryByTestId } = await actRender(<RestaurantList />, ['/restaurants'])
  const field = await queryByTestId('search-field')
  const input = within(field).getByTestId('input-field')
  fireEvent.change(input, { target: { value: 'zz' } })
  expect(input.value).toBe('zz')
})

test('text search works', async () => {
  const { getByTestId } = await actRender(<RestaurantList />, ['/restaurants'])
  const field = await getByTestId('search-field')
  const input = within(field).getByTestId('input-field')
  fireEvent.change(input, { target: { value: 'zz' } })

  const entries = within(getByTestId('list')).getAllByTestId('list-entry')
  expect(entries.length).toBe(2)
})

test('category filter works', async () => {
  const { getByTestId } = await actRender(<RestaurantList />, ['/restaurants'])
  const entries = within(getByTestId('list')).getAllByTestId('list-entry')
  expect(entries.length).toBe(3)

  const toggle = await getByTestId('category-dropdown-toggle')
  fireEvent.click(toggle)
  const entry = await getByTestId('category-dropdown-entry')
  fireEvent.click(entry)
  const newEntries = within(getByTestId('list')).getByText('Sorry, No restaurants available :C')
  expect(newEntries).toBeInTheDocument()

})
