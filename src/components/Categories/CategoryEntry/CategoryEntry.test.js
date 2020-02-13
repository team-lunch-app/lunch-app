import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import CategoryEntry from './CategoryEntry'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../../../services/category.js')

const testcategory = {
  name: 'Pizza',
  id: 13
}

test('renders category name', async () => {
  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/admin/categories']}>
      <CategoryEntry category={testcategory} />
    </MemoryRouter>
  )

  const categoryName = getByTestId('categoryEntry-name')
  expect(categoryName).toBeInTheDocument()
})

test('renders delete button', async () => {
  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/admin/categories']}>
      <CategoryEntry category={testcategory} />
    </MemoryRouter>
  )

  const removeButton = getByTestId('categoryEntry-removeButton')
  expect(removeButton).toBeInTheDocument()
})

test('pressing the delete button calls the provided callback', async () => {
  const mockOnRemove = jest.fn()
  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/admin/categories']}>
      <CategoryEntry category={testcategory} onRemove={mockOnRemove} />
    </MemoryRouter>
  )

  const removeButton = getByTestId('categoryEntry-removeButton')
  fireEvent.click(removeButton)
  expect(mockOnRemove).toBeCalledWith(testcategory)
})

test('renders edit button', async () => {
  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/admin/categories']}>
      <CategoryEntry category={testcategory} />
    </MemoryRouter>
  )

  const editButton = getByTestId('categoryEntry-editButton')
  expect(editButton).toBeInTheDocument()
})
