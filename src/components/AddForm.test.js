import React from 'react'
import { fireEvent, wait, waitForElementToBeRemoved, waitForElement } from '@testing-library/react'
import { actRender } from '../test/utilities'
import AddForm from './AddForm'
import restaurantService from '../services/restaurant'
import categoryService from '../services/category'
import App from '../App'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../services/restaurant.js')
jest.mock('../services/category.js')

beforeEach(() => {
  jest.clearAllMocks()
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])
})

test('invalid input displays an error message', async () => {
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/add']}>
      <AddForm />
    </MemoryRouter>
  )

  const buttonElement = await queryByTestId('addForm-addButton')
  fireEvent.click(buttonElement)

  const error = await queryByTestId('addForm-errorMessage')
  expect(error).toBeInTheDocument()
})

test('add button calls restaurant service with correct arguments', async () => {
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/add']}>
      <AddForm />
    </MemoryRouter>
  )

  // Input test data
  const nameElement = await queryByTestId('addForm-nameField')
  fireEvent.change(nameElement, { target: { value: 'Lidl City Center' } })
  const urlElement = await queryByTestId('addForm-urlField')
  fireEvent.change(urlElement, { target: { value: 'https://www.lidl.fi/' } })

  // Test that the restaurant service is called
  const buttonElement = await queryByTestId('addForm-addButton')
  fireEvent.click(buttonElement)

  await wait(() => expect(restaurantService.add).toBeCalledWith({ name: 'Lidl City Center', url: 'https://www.lidl.fi/', categories: [] }))
})

test('form is closed after adding a restaurant', async () => {
  const { queryByTestId, getByTestId } = await actRender(
    <MemoryRouter initialEntries={['/add']}>
      <App />
    </MemoryRouter>
  )

  // Input test data
  const nameElement = queryByTestId('addForm-nameField')
  fireEvent.change(nameElement, { target: { value: 'Lidl City Center' } })
  const urlElement = queryByTestId('addForm-urlField')
  fireEvent.change(urlElement, { target: { value: 'https://www.lidl.fi/' } })

  const buttonElement = queryByTestId('addForm-addButton')
  fireEvent.click(buttonElement)

  await waitForElementToBeRemoved(() => getByTestId('addForm'))
})

test('pressing cancel hides the component', async () => {
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/add']}>
      <App />
    </MemoryRouter>
  )

  // Hide the form
  const buttonElement = queryByTestId('addForm-cancelButton')
  fireEvent.click(buttonElement)

  const addForm = queryByTestId('addForm')
  await wait(() => expect(addForm).not.toBeInTheDocument())
})

test('form is empty if restaurant is not found with the given id parameter', async () => {
  restaurantService.getOneById.mockRejectedValue({ message: 'Error.' })

  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/edit/1']}>
      <App />
    </MemoryRouter>
  )

  const nameField = queryByTestId('addForm-nameField')
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
    <MemoryRouter initialEntries={['/edit/1']}>
      <App />
    </MemoryRouter>
  )

  const nameField = await waitForElement(() => queryByTestId('addForm-nameField'))
  expect(nameField.value).toBe('Luigi\'s pizza')
})
