import React from 'react'
import { fireEvent, within, act } from '@testing-library/react'
import RestaurantForm from './RestaurantForm'

import categoryService from '../../../services/category'
import locationService from '../../../services/location'

import { actRender } from '../../../test/utilities'

jest.mock('../../../services/category.js')
jest.mock('../../../services/location.js')

const createEmptyRestaurant = () => ({ name: '', url: '', categories: [] })

beforeEach(() => {
  jest.clearAllMocks()
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])
  locationService.getCoordinates.mockResolvedValue({ latitude: 60, longitude: 24 })
  locationService.getDistance.mockResolvedValue(1000)
})

describe('form alerts', () => {
  test('name error message is hidden by default', async () => {
    const { getByTestId } = await actRender(
      <RestaurantForm
        restaurant={createEmptyRestaurant()}
        setRestaurant={jest.fn()}
        error={''}
        setError={jest.fn()}
        onSubmit={jest.fn()}
      />)

    const form = getByTestId(/restaurant-form/i)
    const nameField = within(form).getByTestId(/name-field/i)
    const error = within(nameField).queryByRole(/alert/i)
    expect(error).not.toBeInTheDocument()
  })

  test('invalid name input displays an error message', async () => {
    const { getByTestId } = await actRender(
      <RestaurantForm
        restaurant={createEmptyRestaurant()}
        setRestaurant={jest.fn()}
        error={''}
        setError={jest.fn()}
        onSubmit={jest.fn()}
      />)

    const form = getByTestId(/restaurant-form/i)
    const buttonElement = within(form).getByTestId(/submit-button/i)
    await act(async () => fireEvent.click(buttonElement))

    const nameField = within(form).getByTestId(/name-field/i)
    const error = within(nameField).getByRole(/alert/i)
    expect(error).toBeInTheDocument()
  })

  test('url error message is hidden by default', async () => {
    const { getByTestId } = await actRender(
      <RestaurantForm
        restaurant={createEmptyRestaurant()}
        setRestaurant={jest.fn()}
        error={''}
        setError={jest.fn()}
        onSubmit={jest.fn()}
      />)

    const form = getByTestId(/restaurant-form/i)
    const urlField = within(form).getByTestId(/url-field/i)
    const error = within(urlField).queryByRole(/alert/i)
    expect(error).not.toBeInTheDocument()
  })

  test('invalid url input displays an error message', async () => {
    const { getByTestId } = await actRender(
      <RestaurantForm
        restaurant={createEmptyRestaurant()}
        setRestaurant={jest.fn()}
        error={''}
        setError={jest.fn()}
        onSubmit={jest.fn()}
      />)

    const form = getByTestId(/restaurant-form/i)
    const buttonElement = within(form).getByTestId(/submit-button/i)
    await act(async () => fireEvent.click(buttonElement))

    const urlField = within(form).getByTestId(/url-field/i)
    const error = within(urlField).getByRole(/alert/i)
    expect(error).toBeInTheDocument()
  })
})

test('name field accepts text input', async () => {
  const mockSetRestaurant = jest.fn()
  const { getByTestId } = await actRender(
    <RestaurantForm
      restaurant={createEmptyRestaurant()}
      setRestaurant={mockSetRestaurant}
      error={''}
      setError={jest.fn()}
      onSubmit={jest.fn()}
    />)

  const form = getByTestId(/restaurant-form/i)
  const nameField = within(form).getByTestId(/name-field/i)

  // Input test data
  const nameElement = within(nameField).getByRole(/textbox/i)
  fireEvent.change(nameElement, { target: { value: 'Lidl City Center' } })

  expect(mockSetRestaurant).toBeCalledWith({ name: 'Lidl City Center', url: '', categories: [] })
})

test('url field accepts text input', async () => {
  const mockSetRestaurant = jest.fn()
  const { getByTestId } = await actRender(
    <RestaurantForm
      restaurant={createEmptyRestaurant()}
      setRestaurant={mockSetRestaurant}
      error={''}
      setError={jest.fn()}
      onSubmit={jest.fn()}
    />)

  const form = getByTestId(/restaurant-form/i)
  const urlField = within(form).getByTestId(/url-field/i)

  // Input test data
  const nameElement = within(urlField).getByRole(/textbox/i)
  fireEvent.change(nameElement, { target: { value: 'https://www.lidl.fi/' } })

  expect(mockSetRestaurant).toBeCalledWith({ name: '', url: 'https://www.lidl.fi/', categories: [] })
})

test('add button calls restaurant callback with correct arguments', async () => {
  const mockSubmit = jest.fn()
  window.alert = jest.fn(() => true)

  const { getByTestId } = await actRender(
    <RestaurantForm
      restaurant={{
        name: 'Lidl City Center',
        url: 'https://www.lidl.fi/',
        categories: [],
      }}
      setRestaurant={jest.fn()}
      error={''}
      setError={jest.fn()}
      onSubmit={mockSubmit}
    />)

  const form = getByTestId(/restaurant-form/i)
  const buttonElement = within(form).getByTestId(/submit-button/i)

  await act(async () => {
    fireEvent.click(buttonElement)
  })

  expect(mockSubmit).toBeCalledWith({ name: 'Lidl City Center', url: 'https://www.lidl.fi/', categories: [] })
})

test('form is closed after adding a restaurant', async () => {
  const mockSubmit = jest.fn()
  window.alert = jest.fn(() => true)

  const { getByTestId, getPath } = await actRender(
    <RestaurantForm
      restaurant={{
        name: 'Lidl City Center',
        url: 'https://www.lidl.fi/',
        categories: [],
      }}
      setRestaurant={jest.fn()}
      error={''}
      setError={jest.fn()}
      onSubmit={mockSubmit}
    />,
    ['/initial/path'])

  const form = getByTestId(/restaurant-form/i)
  const buttonElement = within(form).getByTestId(/submit-button/i)
  await act(async () => fireEvent.click(buttonElement))

  expect(getPath().pathname).toBe('/')
})

test('pressing cancel hides the component', async () => {
  const { getByTestId, getPath } = await actRender(
    <RestaurantForm
      restaurant={{
        name: 'Lidl City Center',
        url: 'https://www.lidl.fi/',
        categories: [],
      }}
      setRestaurant={jest.fn()}
      error={''}
      setError={jest.fn()}
      onSubmit={jest.fn()}
    />,
    ['/some/path'])

  const form = getByTestId(/restaurant-form/i)
  const buttonElement = within(form).getByTestId(/cancel-button/i)
  fireEvent.click(buttonElement)

  expect(getPath().pathname).toBe('/')
})
