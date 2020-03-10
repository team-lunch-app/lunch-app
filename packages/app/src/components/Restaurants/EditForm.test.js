import React from 'react'
import { within, fireEvent } from '@testing-library/react'
import EditForm from './EditForm'

import restaurantService from '../../services/restaurant'
import suggestionService from '../../services/suggestion'
import categoryService from '../../services/category'
import authService from '../../services/authentication'
import locationService from '../../services/location'

import { actRender } from '../../test/utilities'
import { act } from 'react-dom/test-utils'

jest.mock('../../services/restaurant.js')
jest.mock('../../services/suggestion.js')
jest.mock('../../services/category.js')
jest.mock('../../services/location.js')
jest.mock('../../services/authentication.js')

beforeEach(() => {
  jest.clearAllMocks()
  authService.getToken.mockReturnValue(undefined)
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])
  locationService.getCoordinates.mockResolvedValue({ latitude: 69, longitude: 42 })
  locationService.getDistance.mockResolvedValue(1234)
})

test('form is not rendered if restaurant cannot be found', async () => {
  restaurantService.getOneById.mockRejectedValue({ message: 'Error.' })

  const { queryByTestId } = await actRender(
    <EditForm id={1} />,
    ['/edit/1']
  )

  const error = queryByTestId(/error-msg-generic/i)
  const form = queryByTestId(/restaurant-form/i)
  expect(error).toBeInTheDocument()
  expect(form).not.toBeInTheDocument()
})

test('form is pre-filled if a restaurant is found with the given id parameter', async () => {
  restaurantService.getOneById.mockResolvedValue(
    {
      name: 'Luigi\'s pizza',
      url: 'www.pizza.fi',
      id: 1,
      categories: [],
    }
  )

  const { getByTestId } = await actRender(
    <EditForm id={1} />,
    ['/edit/1']
  )

  const form = getByTestId(/restaurant-form/i)
  const nameField = within(within(form).getByTestId(/name-field/i)).getByRole(/textbox/i)
  const urlField = within(within(form).getByTestId(/url-field/i)).getByRole(/textbox/i)
  expect(nameField.value).toBe('Luigi\'s pizza')
  expect(urlField.value).toBe('www.pizza.fi')
})

describe('when logged in', () => {
  test('pressing submit makes call to restaurant service', async () => {
    const edited = {
      name: 'Luigin pitseria',
      url: 'www.pitsa.fi',
      categories: [],
    }

    authService.getToken.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNDUzYmFlNjZiYjNkMjUxZGMwM2U5YyIsInVzZXJuYW1lIjoiTWFrZSIsImlhdCI6MTU4MTU5OTg5MX0.0BDsns4hxWvMguZq8llaB3gMTvPNDkDhPkl7mCYl928')

    restaurantService.getOneById.mockResolvedValue(
      {
        name: 'Luigi\'s pizza',
        url: 'www.pizza.fi',
        id: 1,
        categories: [],
      }
    )

    const { getByTestId } = await actRender(
      <EditForm id={1} />,
      ['/edit/1']
    )

    const form = getByTestId(/restaurant-form/i)
    const nameField = within(within(form).getByTestId(/name-field/i)).getByRole(/textbox/i)
    const urlField = within(within(form).getByTestId(/url-field/i)).getByRole(/textbox/i)

    fireEvent.change(nameField, { target: { value: edited.name } })
    fireEvent.change(urlField, { target: { value: edited.url } })

    const checkElement = within(form).getByTestId(/check-button/i)
    const buttonElement = within(form).getByTestId(/submit-button/i)
    await act(async () => fireEvent.click(checkElement))
    await act(async () => fireEvent.click(buttonElement))

    expect(restaurantService.update).toBeCalledWith(expect.objectContaining({
      ...edited
    }))
  })
})

describe('when not logged in', () => {
  test('pressing submit makes call to suggestion service', async () => {
    const edited = {
      name: 'Luigin pitseria',
      url: 'www.pitsa.fi',
      id: 1,
      categories: [],
    }

    restaurantService.add.mockResolvedValue({ ...edited })

    restaurantService.getOneById.mockResolvedValue(
      {
        name: 'Luigi\'s pizza',
        url: 'www.pizza.fi',
        id: 1,
        categories: [],
      }
    )

    const { getByTestId } = await actRender(
      <EditForm id={1} />,
      ['/edit/1']
    )

    const form = getByTestId(/restaurant-form/i)
    const nameField = within(within(form).getByTestId(/name-field/i)).getByRole(/textbox/i)
    const urlField = within(within(form).getByTestId(/url-field/i)).getByRole(/textbox/i)

    fireEvent.change(nameField, { target: { value: edited.name } })
    fireEvent.change(urlField, { target: { value: edited.url } })

    const checkElement = within(form).getByTestId(/check-button/i)
    const buttonElement = within(form).getByTestId(/submit-button/i)
    await act(async () => fireEvent.click(checkElement))
    await act(async () => fireEvent.click(buttonElement))

    expect(suggestionService.editRestaurant).toBeCalledWith(expect.objectContaining({ ...edited }))
  })
})
