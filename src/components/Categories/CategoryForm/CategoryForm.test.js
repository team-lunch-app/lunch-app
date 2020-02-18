import React from 'react'
import { fireEvent, wait, waitForElement, waitForDomChange } from '@testing-library/react'
import CategoryForm from './CategoryForm'
import categoryService from '../../../services/category'
import { Route } from 'react-router-dom'

import { actRender } from '../../../test/utilities'

jest.mock('../../../services/category.js')

beforeEach(() => {
  jest.clearAllMocks()
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])
})

test('invalid name input displays an error message', async () => {
  const { queryByTestId } = await actRender(
    <CategoryForm onSubmit={jest.fn()} />,
    ['/admin/categories/add']
  )

  const buttonElement = await queryByTestId('categoryForm-addButton')
  fireEvent.click(buttonElement)

  await waitForDomChange()

  const error = await queryByTestId('categoryForm-nameErrorMessage')
  expect(error).toBeInTheDocument()
})

test('add button calls category callback with correct arguments', async () => {
  const mockSubmit = jest.fn()
  const { queryByTestId } = await actRender(
    <CategoryForm onSubmit={mockSubmit} />,
    ['/admin/categories/add']
  )

  // Input test data
  const nameElement = await queryByTestId('categoryForm-nameField')
  fireEvent.change(nameElement, { target: { value: 'Burgers' } })

  // Test that the category service is called
  const buttonElement = await queryByTestId('categoryForm-addButton')
  fireEvent.click(buttonElement)

  await wait(() => expect(mockSubmit).toBeCalledWith({ name: 'Burgers' }))
})

test('form is closed after adding a category', async () => {
  const { queryByTestId, getPath } = await actRender(
    <CategoryForm onSubmit={jest.fn()} />,
    ['/admin/categories/add']
  )

  // Input test data
  const nameElement = queryByTestId('categoryForm-nameField')
  fireEvent.change(nameElement, { target: { value: 'Burger' } })

  const buttonElement = queryByTestId('categoryForm-addButton')
  fireEvent.click(buttonElement)

  await wait(() => expect(getPath().pathname).toBe('/admin/categories'))
})

test('pressing cancel hides the component', async () => {
  const { queryByTestId, getPath } = await actRender(
    <CategoryForm onSubmit={jest.fn()} />,
    ['/admin/categories/add']
  )

  // Hide the form
  const buttonElement = queryByTestId('categoryForm-cancelButton')
  fireEvent.click(buttonElement)

  await wait(() => expect(getPath().pathname).toBe('/admin/categories'))
})

test('form is empty if category is not found with the given id parameter', async () => {
  categoryService.getOneById.mockRejectedValue({ response: { status: 404 }, message: 'Error.' })

  const { queryByTestId } = await actRender(
    <CategoryForm id={1} />,
    ['/admin/categories/edit/1']
  )

  const nameField = queryByTestId('categoryForm-nameField')
  expect(nameField.value).toBe('')
})

test('form is pre-filled if a category is found with the given id parameter', async () => {
  categoryService.getOneById.mockResolvedValue(
    {
      name: 'Pizza',
      id: 1,
    }
  )

  const { queryByTestId } = await actRender(
    <CategoryForm id={1} />,
    ['/admin/categories/edit/1']
  )

  const nameField = await waitForElement(() => queryByTestId('categoryForm-nameField'))
  expect(nameField.value).toBe('Pizza')
})
