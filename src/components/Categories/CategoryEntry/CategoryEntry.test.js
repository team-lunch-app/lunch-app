import React from 'react'
import { fireEvent } from '@testing-library/react'
import CategoryEntry from './CategoryEntry'

import { actRender } from '../../../test/utilities'

jest.mock('../../../services/category.js')

const testcategory = {
  name: 'Pizza',
  id: 13
}

test('renders category name', async () => {
  const { getByTestId } = await actRender(<CategoryEntry category={testcategory} />, ['/admin/categories'])

  const categoryName = getByTestId('categoryEntry-name')
  expect(categoryName).toBeInTheDocument()
})

test('renders delete button', async () => {
  const { getByTestId } = await actRender(<CategoryEntry category={testcategory} />, ['/admin/categories'])

  const removeButton = getByTestId('categoryEntry-removeButton')
  expect(removeButton).toBeInTheDocument()
})

test('pressing the delete button calls the provided callback', async () => {
  const mockOnRemove = jest.fn()
  const { getByTestId } = await actRender(
    <CategoryEntry category={testcategory} onRemove={mockOnRemove} />,
    ['/admin/categories']
  )

  const removeButton = getByTestId('categoryEntry-removeButton')
  fireEvent.click(removeButton)
  expect(mockOnRemove).toBeCalledWith(testcategory)
})

test('renders edit button', async () => {
  const { getByTestId } = await actRender(<CategoryEntry category={testcategory} />, ['/admin/categories'])

  const editButton = getByTestId('categoryEntry-editButton')
  expect(editButton).toBeInTheDocument()
})
