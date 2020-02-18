import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
import categoryService from '../../../services/category'
import { actRender } from '../../../test/utilities'
import CategoryList from './CategoryList'

jest.mock('../../../services/category.js')

beforeEach(() => {
  jest.clearAllMocks()
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'Salads' }, { id: 15, name: 'Burger' }])
})

test('page title is rendered', async () => {
  const { queryByTestId } = await actRender(<CategoryList />, ['/admin/categories'])
  const title = await queryByTestId('categoryList-title')
  expect(title).toBeInTheDocument()
})

test('back button is rendered', async () => {
  const { queryByTestId} = await actRender(<CategoryList />, ['/admin/categories'])
  const backButton = await queryByTestId('categoryList-backButton')
  expect(backButton).toBeInTheDocument()
})

test('back button returns to the home page', async () => {
  const { queryByTestId, getPath } = await actRender(<CategoryList />, ['/admin/categories'])

  const buttonElement = queryByTestId('categoryList-backButton')
  fireEvent.click(buttonElement)
  await wait(() => expect(getPath().pathname).toBe('/admin'))
})

test('informative message is rendered if no categorys exist', async () => {
  categoryService.getAll.mockResolvedValue([])

  const { queryByTestId } = await actRender(<CategoryList />, ['/admin/categories'])
  const message = await queryByTestId('categoryList-alertMessage')
  expect(message).toBeInTheDocument()
})

test('a category is rendered if one exists', async () => {
  categoryService.getAll.mockResolvedValue([{
    name: 'Pizza',
    id: 1
  }])

  const { queryByTestId } = await actRender(<CategoryList />, ['/admin/categories'])
  const category = await queryByTestId('categoryList-categoryEntry')
  expect(category).toBeInTheDocument()
})

test('multiple categories are rendered if more than one exist', async () => {
  const { queryAllByTestId } = await actRender(<CategoryList />, ['/admin/categories'])
  const categories = await queryAllByTestId('categoryList-categoryEntry')
  expect(categories.length).toBeGreaterThan(1)
})

test('pressing the delete button calls the service to remove the category if OK is pressed', async () => {
  categoryService.getAll.mockResolvedValue([{
    name: 'Pizza',
    id: 13
  }])

  window.confirm = jest.fn(() => true)

  const { getByTestId } = await actRender(<CategoryList />, ['/admin/categories'])

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

  const { getByTestId } = await actRender(<CategoryList />, ['/admin/categories'])
  const removeButton = getByTestId('categoryEntry-removeButton')
  fireEvent.click(removeButton)
  expect(categoryService.remove).not.toBeCalled()
})
