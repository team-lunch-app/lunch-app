import React from 'react'
import { render, fireEvent, waitForElement, waitForElementToBeRemoved } from '@testing-library/react'
import categoryService from '../../../services/category'
import App from '../../../App'
import CategoryList from './CategoryList'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../../../services/category.js')

beforeEach(() => {
  jest.clearAllMocks()
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'Salads' }, { id: 15, name: 'Burger' }])
  
})

test('page title is rendered', async () => {
  const { queryByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={['/admin/categories']}>
      <CategoryList categoryService={categoryService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('categoryList-loading'))

  const title = await queryByTestId('categoryList-title')
  expect(title).toBeInTheDocument()
})

test('back button is rendered', async () => {
  const { queryByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={['/admin/categories']}>
      <CategoryList categoryService={categoryService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('categoryList-loading'))

  const backButton = await queryByTestId('categoryList-backButton')
  expect(backButton).toBeInTheDocument()
})

test('back button returns to the home page', async () => {
  const { queryByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={['/admin/categories']}>
      <App categoryService={categoryService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('categoryList-loading'))

  // Press the back button
  const buttonElement = queryByTestId('categoryList-backButton')
  fireEvent.click(buttonElement)

  await waitForElement(() => getByTestId('randomizer'), { timeout: 250 })

  const categoryList = queryByTestId('categoryList')
  expect(categoryList).not.toBeInTheDocument()
})

test('informative message is rendered if no categorys exist', async () => {
  categoryService.getAll.mockResolvedValue([])

  const { queryByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={['/admin/categories']}>
      <CategoryList categoryService={categoryService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('categoryList-loading'))

  const message = await queryByTestId('categoryList-alertMessage')
  expect(message).toBeInTheDocument()
})

test('a category is rendered if one exists', async () => {
  categoryService.getAll.mockResolvedValue([{
    name: 'Pizza',
    id: 1
  }])

  const { queryByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={['/admin/categories']}>
      <CategoryList categoryService={categoryService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('categoryList-loading'))

  const category = await queryByTestId('categoryList-categoryEntry')
  expect(category).toBeInTheDocument()
})

test('multiple categories are rendered if more than one exist', async () => {
  const { queryAllByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={['/admin/categories']}>
      <CategoryList categoryService={categoryService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('categoryList-loading'))

  const categories = await queryAllByTestId('categoryList-categoryEntry')
  expect(categories.length).toBeGreaterThan(1)
})

test('pressing the delete button calls the service to remove the category if OK is pressed', async () => {
  categoryService.getAll.mockResolvedValue([{
    name: 'Pizza',
    id: 13
  }])

  window.confirm = jest.fn(() => true)

  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/admin/categories']}>
      <CategoryList categoryService={categoryService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('categoryList-loading'))

  const removeButton = getByTestId('categoryEntry-removeButton')
  fireEvent.click(removeButton)
  expect(categoryService.remove).toBeCalledWith(13)
})

test('pressing the delete button does not attempt to remove the category if cancel is pressed', async () => {
  categoryService.getAll.mockResolvedValue([{
    name: 'Pizza',
    id: 13
  }])

  window.confirm = jest.fn(() => false)

  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/admin/categories']}>
      <CategoryList categoryService={categoryService} />
    </MemoryRouter>
  )

  await waitForElementToBeRemoved(() => getByTestId('categoryList-loading'))

  const removeButton = getByTestId('categoryEntry-removeButton')
  fireEvent.click(removeButton)
  expect(categoryService.remove).not.toBeCalled()
})
