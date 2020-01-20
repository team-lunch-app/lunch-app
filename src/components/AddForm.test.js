import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import AddForm from './AddForm'
import restaurantService from '../services/restaurant'

jest.mock('../services/restaurant.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('component is hidden initially', () => {
  const { queryByTestId } = render(<AddForm />)
  const form = queryByTestId('addForm')
  expect(form).not.toBeInTheDocument()
})

test('visibility toggle button is visible initially', () => {
  const { queryByTestId } = render(<AddForm />)
  const button = queryByTestId('visibilityToggle')
  expect(button).toBeInTheDocument()
})

test('component is rendered when button is pressed', () => {
  const { queryByTestId } = render(<AddForm />)
  const button = queryByTestId('visibilityToggle')
  fireEvent.click(button)
  const form = queryByTestId('addForm')
  expect(form).toBeInTheDocument()
})

test('invalid input displays an error message', () => {
  const { queryByTestId } = render(<AddForm restaurantService={restaurantService} />)

  // Open the form
  const button = queryByTestId('visibilityToggle')
  fireEvent.click(button)

  const buttonElement = queryByTestId('addForm-addButton')
  fireEvent.click(buttonElement)

  const error = queryByTestId('addForm-errorMessage')
  expect(error).toBeInTheDocument()
})

test('add button calls restaurantservice', () => {
  const { queryByTestId } = render(<AddForm restaurantService={restaurantService} />)

  // Open the form
  const button = queryByTestId('visibilityToggle')
  fireEvent.click(button)

  // Input test data
  const nameElement = queryByTestId('addForm-nameField')
  fireEvent.change(nameElement, { target: { value: 'Lidl City Center' } })
  const urlElement = queryByTestId('addForm-urlField')
  fireEvent.change(urlElement, { target: { value: 'https://www.lidl.fi/' } })

  // Test that the restaurant service is called
  const buttonElement = queryByTestId('addForm-addButton')
  fireEvent.click(buttonElement)
  expect(restaurantService.add).toBeCalled()

  // Test that the form is closed after hitting submit
  const form = queryByTestId('addForm')
  expect(form).not.toBeInTheDocument()
})

test('pressing cancel hides the component', () => {
  const { queryByTestId } = render(<AddForm restaurantService={restaurantService} />)

  // Open the form
  const button = queryByTestId('visibilityToggle')
  fireEvent.click(button)

  // Hide the form
  const buttonElement = queryByTestId('addForm-cancelButton')
  fireEvent.click(buttonElement)

  const form = queryByTestId('addForm')
  expect(form).not.toBeInTheDocument()
})
