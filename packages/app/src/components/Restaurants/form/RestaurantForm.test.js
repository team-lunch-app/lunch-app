import React from 'react'
import { fireEvent, within, wait } from '@testing-library/react'
import RestaurantForm from './RestaurantForm'

import categoryService from '../../../services/category'
import locationService from '../../../services/location'
import placeService from '../../../services/places'

import testdata from '../../../util/testData'

import { act } from 'react-dom/test-utils'

import { actRender } from '../../../test/utilities'

jest.mock('../../../services/category.js')
jest.mock('../../../services/location.js')
jest.mock('../../../services/places.js')

const createEmptyRestaurant = () => ({ name: '', url: '', categories: [] })

beforeEach(() => {
  jest.clearAllMocks()
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])
  locationService.getCoordinates.mockResolvedValue({ latitude: 69, longitude: 42 })
  locationService.getDistance.mockResolvedValue(1234)
  locationService.getLeg.mockResolvedValue({
    duration: 1660,
    distance: 1956.084,
    legGeometry: { length: 114, points: 'o}fnJ{ofwCM?K@Q@e@Vk@pA?V@z@S@@j@@f@?BA@oBpAEJ…s@t@G?IHIHALeAfAAAGFEFEDGFIJ{AjBaB|Bw@hAw@lAU^Ym@' },
    from: { lat: 60.17, lon: 24.941944 },
    to: { lat: 60.182315, lon: 24.922893 }
  })
  placeService.getSuggestions.mockResolvedValue(testdata.getSuggestions())
  placeService.getRestaurant.mockResolvedValue(testdata.getRestaurant())
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
    const checkElement = within(form).getByTestId(/check-button/i)
    await act(async () => fireEvent.click(checkElement))
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
        restaurant={{ ...createEmptyRestaurant(), url: 'bb' }}
        setRestaurant={jest.fn()}
        error={''}
        setError={jest.fn()}
        onSubmit={jest.fn()}
      />)

    const form = getByTestId(/restaurant-form/i)
    const buttonElement = within(form).getByTestId(/submit-button/i)
    const checkElement = within(form).getByTestId(/check-button/i)
    await act(async () => fireEvent.click(checkElement))
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

test('address field accepts text input', async () => {
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
  const addressField = within(form).getByTestId(/address-field/i)

  // Input test data
  const nameElement = within(addressField).getByRole(/textbox/i)
  fireEvent.change(nameElement, { target: { value: 'Jokukatu 42' } })

  expect(mockSetRestaurant).toBeCalledWith(expect.objectContaining({
    address: 'Jokukatu 42'
  }))
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

test('pressing check when address can be resolved calls setRestaurant with coordinates and distance', async () => {
  const mockSetRestaurant = jest.fn()
  window.alert = jest.fn(() => true)

  const { getByTestId } = await actRender(
    <RestaurantForm
      restaurant={{
        name: 'Lidl City Center',
        url: 'https://www.lidl.fi/',
        address: 'Jokukatu 42',
        categories: [],
        distance: 1000,
        coordinates: undefined
      }}
      setRestaurant={mockSetRestaurant}
      error={''}
      setError={jest.fn()}
      onSubmit={jest.fn()}
    />)

  const form = getByTestId(/restaurant-form/i)
  const checkButton = within(form).getByTestId(/check-button/i)

  await act(async () => { fireEvent.click(checkButton) })

  expect(mockSetRestaurant).toBeCalledWith(expect.objectContaining({
    name: 'Lidl City Center',
    url: 'https://www.lidl.fi/',
    categories: [],
    address: 'Jokukatu 42',
    coordinates: {
      latitude: 69,
      longitude: 42,
    },
    distance: 1234,
  }))
})

describe('when restaurant is not validated', () => {
  test('add button does not call set restaurant callback', async () => {
    const mockSubmit = jest.fn()
    window.alert = jest.fn(() => true)

    const { getByTestId } = await actRender(
      <RestaurantForm
        restaurant={{
          name: 'Lidl City Center',
          url: 'https://www.lidl.fi/',
          address: 'Jokukatu 42',
          categories: [],
          distance: 1234,
          coordinates: undefined
        }}
        setRestaurant={jest.fn()}
        error={''}
        setError={jest.fn()}
        onSubmit={mockSubmit}
      />)

    const form = getByTestId(/restaurant-form/i)
    const buttonElement = within(form).getByTestId(/submit-button/i)

    await act(async () => { fireEvent.click(buttonElement) })

    expect(mockSubmit).not.toBeCalled()
  })

  test('a check with an invalid address displays an error message', async () => {
    window.alert = jest.fn(() => true)
    locationService.getCoordinates.mockRejectedValue({ error: 'Boo!' })

    const { getByTestId } = await actRender(
      <RestaurantForm
        restaurant={{
          name: 'Lidl City Center',
          url: 'https://www.lidl.fi/',
          address: 'Jokukatu 42',
          categories: [],
          distance: 1234,
          coordinates: undefined
        }}
        setRestaurant={jest.fn()}
        error={''}
        setError={jest.fn()}
        onSubmit={jest.fn()}
      />)

    const form = getByTestId(/restaurant-form/i)
    const checkButton = within(form).getByTestId(/check-button/i)

    await act(async () => { fireEvent.click(checkButton) })

    expect(within(form).getByTestId(/error-msg-generic/i)).toBeInTheDocument()
  })
})

describe('when restaurant is validated', () => {
  test('add button calls restaurant callback with correct arguments', async () => {
    const mockSubmit = jest.fn()
    window.alert = jest.fn(() => true)

    const { getByTestId } = await actRender(
      <RestaurantForm
        restaurant={{
          name: 'Lidl City Center',
          url: 'https://www.lidl.fi/',
          address: 'Jokukatu 42',
          categories: [],
          distance: 1234,
          coordinates: undefined
        }}
        setRestaurant={jest.fn()}
        error={''}
        setError={jest.fn()}
        onSubmit={mockSubmit}
      />)

    const form = getByTestId(/restaurant-form/i)
    const buttonElement = within(form).getByTestId(/submit-button/i)
    const checkButton = within(form).getByTestId(/check-button/i)

    await act(async () => { fireEvent.click(checkButton) })
    await act(async () => { fireEvent.click(buttonElement) })

    expect(mockSubmit).toBeCalledWith(expect.objectContaining({
      name: 'Lidl City Center',
      url: 'https://www.lidl.fi/',
      categories: [],
      address: 'Jokukatu 42',
      coordinates: undefined,
      distance: 1234
    }))
  })

  test('modifying the address after check blocks submit button', async () => {
    const mockSubmit = jest.fn()
    window.alert = jest.fn(() => true)

    const { getByTestId } = await actRender(
      <RestaurantForm
        restaurant={{
          name: 'Lidl City Center',
          url: 'https://www.lidl.fi/',
          address: 'Jokukatu 42',
          categories: [],
          distance: 1234,
          coordinates: undefined
        }}
        setRestaurant={jest.fn()}
        error={''}
        setError={jest.fn()}
        onSubmit={mockSubmit}
      />)

    const form = getByTestId(/restaurant-form/i)
    const buttonElement = within(form).getByTestId(/submit-button/i)
    const checkButton = within(form).getByTestId(/check-button/i)
    await act(async () => fireEvent.click(checkButton))

    const addressField = within(form).getByTestId(/address-field/i)

    // Input test data
    const addressElement = within(addressField).getByRole(/textbox/i)
    fireEvent.change(addressElement, { target: { value: 'Joku toinen katu 24' } })

    await act(async () => fireEvent.click(buttonElement))
    expect(buttonElement).toBeDisabled()
    expect(mockSubmit).not.toBeCalled()
  })

  test('form is closed after adding a restaurant', async () => {
    const mockSubmit = jest.fn()
    window.alert = jest.fn(() => true)

    const { getByTestId, getPath } = await actRender(
      <RestaurantForm
        restaurant={{
          name: 'Lidl City Center',
          url: 'https://www.lidl.fi/',
          address: 'Jokukatu 42',
          categories: []
        }}
        setRestaurant={jest.fn()}
        error={''}
        setError={jest.fn()}
        onSubmit={mockSubmit}
      />,
      ['/initial/path'])

    const form = getByTestId(/restaurant-form/i)
    const buttonElement = within(form).getByTestId(/submit-button/i)
    const checkElement = within(form).getByTestId(/check-button/i)
    await act(async () => fireEvent.click(checkElement))
    await act(async () => fireEvent.click(buttonElement))

    expect(getPath().pathname).toBe('/')
  })
})

test('map is not shown when the restaurant has no coordinates)', async () => {
  const { queryByTestId } = await actRender(
    <RestaurantForm
      restaurant={{
        name: 'Lidl City Center',
        url: 'https://www.lidl.fi/',
        address: 'Jokukatu 42',
        categories: [],
        distance: 1234,
        coordinates: undefined
      }}
      setRestaurant={jest.fn()}
      error={''}
      setError={jest.fn()}
      onSubmit={jest.fn()}
    />)
  expect(queryByTestId('map')).not.toBeInTheDocument()
})


test('map is shown when the restaurant has coordinates true (i.e. when editing an existing restaurant, or after successful address check)', async () => {
  const { queryByTestId } = await actRender(
    <RestaurantForm
      restaurant={{
        name: 'Lidl City Center',
        url: 'https://www.lidl.fi/',
        address: 'Jokukatu 42',
        categories: [],
        distance: 1234,
        coordinates: { latitude: 60.182315, longitude: 24.922893 },
      }}
      setRestaurant={jest.fn()}
      error={''}
      setError={jest.fn()}
      onSubmit={jest.fn()}
    />)
  expect(queryByTestId('map')).toBeInTheDocument()
})


test('name field text input calls placeService.getSuggestions()', async () => {
  const mockSetRestaurant = jest.fn()
  const { getByTestId } = await actRender(
    <RestaurantForm
      restaurant={createEmptyRestaurant()}
      setRestaurant={mockSetRestaurant}
      error={''}
      setError={jest.fn()}
      onSubmit={jest.fn()}
    />)
  jest.useFakeTimers()
  const form = getByTestId(/restaurant-form/i)
  const nameField = within(form).getByTestId(/name-field/i)
  const nameElement = within(nameField).getByRole(/textbox/i)
  fireEvent.change(nameElement, { target: { value: 'Lidl City Center' } })
  jest.runAllTimers()
  await wait(() => expect(placeService.getSuggestions).toBeCalledWith('Lidl City Center'))
})

test('name field text input leads to suggestions being rendered', async () => {
  const mockSetRestaurant = jest.fn()
  placeService.getSuggestions.mockResolvedValue(testdata.getSuggestions().data)

  const { getByTestId, queryByTestId } = await actRender(
    <RestaurantForm
      restaurant={createEmptyRestaurant()}
      setRestaurant={mockSetRestaurant}
      error={''}
      setError={jest.fn()}
      onSubmit={jest.fn()}
    />
  )

  jest.useFakeTimers()
  const form = getByTestId(/restaurant-form/i)
  const nameField = within(form).getByTestId(/name-field/i)
  const nameElement = within(nameField).getByRole(/textbox/i)
  fireEvent.change(nameElement, { target: { value: 'Lidl City Center' } })
  fireEvent.focus(nameElement)
  jest.runAllTimers()

  expect(nameElement).toMatchObject(document.activeElement)
  await wait(() => expect(placeService.getSuggestions).toBeCalledWith('Lidl City Center'))
  expect(queryByTestId('autocomplete-list')).toBeInTheDocument()
  await wait(() => expect(queryByTestId('autocomplete-entry')).toBeInTheDocument())
})

test('clicking on a suggestion calls placeService.getRestaurant', async () => {
  const mockSetRestaurant = jest.fn()
  placeService.getSuggestions.mockResolvedValue(testdata.getSuggestions().data)

  const { getByTestId, queryByTestId } = await actRender(
    <RestaurantForm
      restaurant={createEmptyRestaurant()}
      setRestaurant={mockSetRestaurant}
      error={''}
      setError={jest.fn()}
      onSubmit={jest.fn()}
    />
  )

  jest.useFakeTimers()
  const form = getByTestId(/restaurant-form/i)
  const nameField = within(form).getByTestId(/name-field/i)
  const nameElement = within(nameField).getByRole(/textbox/i)
  fireEvent.change(nameElement, { target: { value: 'Lidl City Center' } })
  fireEvent.focus(nameElement)
  jest.runAllTimers()

  await wait(() => expect(placeService.getSuggestions).toBeCalledWith('Lidl City Center'))
  await wait(() => expect(queryByTestId('autocomplete-list')).toBeInTheDocument())
  await wait(() => {
    const suggestionElement = queryByTestId('autocomplete-entry')
    expect(suggestionElement).toBeInTheDocument()
    fireEvent.click(suggestionElement)
  })
  await wait(() => expect(placeService.getRestaurant).toBeCalledWith('ChIJgWk_zoQJkkYRr0Ye0Tk7DF4'))
})
