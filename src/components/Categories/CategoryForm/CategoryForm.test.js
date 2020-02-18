import React from 'react'
import { fireEvent, wait, waitForElement, waitForDomChange } from '@testing-library/react'
import { actRender } from '../../../test/utilities'
import CategoryForm from './CategoryForm'
import categoryService from '../../../services/category'
import { MemoryRouter, Route } from 'react-router-dom'

jest.mock('../../../services/category.js')

beforeEach(() => {
  jest.clearAllMocks()
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])
})

test('invalid name input displays an error message', async () => {
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/admin/categories/add']}>
      <CategoryForm onSubmit={jest.fn()} />
    </MemoryRouter>
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
    <MemoryRouter initialEntries={['/admin/categories/add']}>
      <CategoryForm onSubmit={mockSubmit} />
    </MemoryRouter>
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
  let path
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/admin/categories/add']}>
      <CategoryForm onSubmit={jest.fn()} />
      <Route path='*' render={({ location }) => { path = location; return null }} />
    </MemoryRouter>
  )

  // Input test data
  const nameElement = queryByTestId('categoryForm-nameField')
  fireEvent.change(nameElement, { target: { value: 'Burger' } })

  const buttonElement = queryByTestId('categoryForm-addButton')
  fireEvent.click(buttonElement)

  await wait(() => expect(path.pathname).toBe('/admin/categories'))
})

test('pressing cancel hides the component', async () => {
  let path
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/admin/categories/add']}>
      <CategoryForm onSubmit={jest.fn()} />
      <Route path='*' render={({ location }) => { path = location; return null }} />
    </MemoryRouter>
  )

  // Hide the form
  const buttonElement = queryByTestId('categoryForm-cancelButton')
  fireEvent.click(buttonElement)

  await wait(() => expect(path.pathname).toBe('/admin/categories'))
})

test('form is empty if category is not found with the given id parameter', async () => {
  categoryService.getOneById.mockRejectedValue({ response : {status: 404}, message: 'Error.' })

  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/admin/categories/edit/1']}>
      <CategoryForm id={1} />
    </MemoryRouter>
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
    <MemoryRouter initialEntries={['/admin/categories/edit/1']}>
      <CategoryForm id={1} />
    </MemoryRouter>
  )

  const nameField = await waitForElement(() => queryByTestId('categoryForm-nameField'))
  expect(nameField.value).toBe('Pizza')
})
