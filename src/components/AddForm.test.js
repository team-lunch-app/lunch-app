import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import AddForm from './AddForm'
import restaurantService from '../services/restaurant'
import App from '../App'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../services/restaurant.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('invalid input displays an error message', async () => {
  const { queryByTestId } = render(
    <MemoryRouter initialEntries={['/add']}>
      <AddForm restaurantService={restaurantService} />
    </MemoryRouter>
  )

  const buttonElement = await queryByTestId('addForm-addButton')
  fireEvent.click(buttonElement)

  const error = await queryByTestId('addForm-errorMessage')
  expect(error).toBeInTheDocument()
})

test('add button calls restaurantservice', async () => {
  const { queryByTestId } = render(
    <MemoryRouter initialEntries={['/add']}>
      <AddForm restaurantService={restaurantService} />
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

  expect(restaurantService.add).toBeCalled()
})


test('form is closed after adding a restaurant', () => {
  const { queryByTestId } = render(
    <MemoryRouter initialEntries={['/add']}>
      <App restaurantService={restaurantService} />
    </MemoryRouter>
  )

  // Input test data
  const nameElement = queryByTestId('addForm-nameField')
  fireEvent.change(nameElement, { target: { value: 'Lidl City Center' } })
  const urlElement = queryByTestId('addForm-urlField')
  fireEvent.change(urlElement, { target: { value: 'https://www.lidl.fi/' } })

  const buttonElement = queryByTestId('addForm-addButton')
  fireEvent.click(buttonElement)

  // Test that the form is closed after hitting submit
  const form = queryByTestId('addForm')
  expect(form).not.toBeInTheDocument()
})

test('pressing cancel hides the component', () => {
  const { queryByTestId } = render(
    <MemoryRouter initialEntries={['/add']}>
      <App restaurantService={restaurantService} />
    </MemoryRouter>
  )

  // Hide the form
  const buttonElement = queryByTestId('addForm-cancelButton')
  fireEvent.click(buttonElement)

  const form = queryByTestId('addForm')
  expect(form).not.toBeInTheDocument()
})
