import React from 'react'
import { fireEvent, wait, waitForElement } from '@testing-library/react'
import { within } from '@testing-library/dom'
import AddForm from './AddForm'
import restaurantService from '../services/restaurant'
import categoryService from '../services/category'

import { actRender } from '../test/utilities'

jest.mock('../services/restaurant.js')
jest.mock('../services/category.js')

beforeEach(() => {
  jest.clearAllMocks()
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])
})


describe('form alerts', () => {
  test('name error message is hidden by default', async () => {
    const { queryByTestId } = await actRender(<AddForm onSubmit={jest.fn()} />, ['/add'])

    const { queryByRole } = within(queryByTestId('addForm-nameField'))
    const error = queryByRole(/alert/i)
    expect(error).not.toBeInTheDocument()
  })

  test('invalid name input displays an error message', async () => {
    const { queryByTestId } = await actRender(<AddForm onSubmit={jest.fn()} />, ['/add'])

    const buttonElement = await queryByTestId('addForm-addButton')
    fireEvent.click(buttonElement)

    const error = await waitForElement(() => within(queryByTestId('addForm-nameField')).getByRole(/alert/i))
    expect(error).toBeInTheDocument()
  })

  test('url error message is hidden by default', async () => {
    const { queryByTestId } = await actRender(<AddForm onSubmit={jest.fn()} />, ['/add'])

    const { queryByRole } = within(queryByTestId('addForm-urlField'))
    const error = queryByRole(/alert/i)
    expect(error).not.toBeInTheDocument()
  })

  test('invalid url input displays an error message', async () => {
    const { queryByTestId } = await actRender(<AddForm onSubmit={jest.fn()} />, ['/add'])

    const buttonElement = await queryByTestId('addForm-addButton')
    fireEvent.click(buttonElement)

    const error = await waitForElement(() => within(queryByTestId('addForm-urlField')).getByRole(/alert/i))
    expect(error).toBeInTheDocument()
  })
})

test('add button calls restaurant callback with correct arguments', async () => {
  const mockSubmit = jest.fn()
  const { queryByTestId } = await actRender(<AddForm onSubmit={mockSubmit} />, ['/add'])

  // Input test data
  const nameElement = within(queryByTestId('addForm-nameField')).getByRole(/textbox/i)
  fireEvent.change(nameElement, { target: { value: 'Lidl City Center' } })
  const urlElement = within(queryByTestId('addForm-urlField')).getByRole(/textbox/i)
  fireEvent.change(urlElement, { target: { value: 'https://www.lidl.fi/' } })

  // Test that the restaurant service is called
  const buttonElement = await queryByTestId('addForm-addButton')
  fireEvent.click(buttonElement)

  await wait(() => expect(mockSubmit).toBeCalledWith({ name: 'Lidl City Center', url: 'https://www.lidl.fi/', categories: [] }))
})

test('form is closed after adding a restaurant', async () => {
  const { queryByTestId, getPath } = await actRender(<AddForm onSubmit={jest.fn()} />, ['/add'])

  // Input test data
  const nameElement = within(queryByTestId('addForm-nameField')).getByRole(/textbox/i)
  fireEvent.change(nameElement, { target: { value: 'Lidl City Center' } })
  const urlElement = within(queryByTestId('addForm-urlField')).getByRole(/textbox/i)
  fireEvent.change(urlElement, { target: { value: 'https://www.lidl.fi/' } })

  const buttonElement = queryByTestId('addForm-addButton')
  fireEvent.click(buttonElement)

  await wait(() => expect(getPath().pathname).toBe('/'))
})

test('pressing cancel hides the component', async () => {
  const { queryByTestId, getPath } = await actRender(<AddForm onSubmit={jest.fn()} />, ['/add'])

  // Hide the form
  const buttonElement = queryByTestId('addForm-cancelButton')
  fireEvent.click(buttonElement)

  await wait(() => expect(getPath().pathname).toBe('/'))
})

test('form is empty if restaurant is not found with the given id parameter', async () => {
  restaurantService.getOneById.mockRejectedValue({ message: 'Error.' })

  const { queryByTestId } = await actRender(
    <AddForm id={1} />,
    ['/edit/1']
  )

  const nameField = within(queryByTestId('addForm-nameField')).getByRole(/textbox/i)
  expect(nameField.value).toBe('')
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

  const { queryByTestId } = await actRender(
    <AddForm id={1} />,
    ['/edit/1']
  )

  const nameField = within(queryByTestId('addForm-nameField')).getByRole(/textbox/i)
  const urlField = within(queryByTestId('addForm-urlField')).getByRole(/textbox/i)
  expect(nameField.value).toBe('Luigi\'s pizza')
  expect(urlField.value).toBe('www.pizza.fi')
})
