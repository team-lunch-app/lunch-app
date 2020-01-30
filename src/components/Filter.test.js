import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Filter from './Filter'

const testCategories = [{ id: 1, name: 'pizza' }, { id: 2, name: 'burger' }, { id: 3, name: 'salads' }]

test('filter list exists', () => {
  const { queryByTestId } = render(<Filter filterCategories={[...testCategories]} setFilterCategories={jest.fn()} />)
  const listElement = queryByTestId('filter-list')
  expect(listElement).toBeInTheDocument()
})

test('filter dropdown exists', () => {
  const { queryByTestId } = render(<Filter filterCategories={[...testCategories]} setFilterCategories={jest.fn()} />)
  const dropdownElement = queryByTestId('filter-dropdown')
  expect(dropdownElement).toBeInTheDocument()
})

test('when deletebutton is pressed, setFilterCategories is called with right value', () => {
  const mockSet = jest.fn()
  const { queryByTestId } = render(<Filter filterCategories={[{ id: 3, name: 'salads' }]} setFilterCategories={mockSet} />)
  const removeButton = queryByTestId('filter-listEntry-deleteButton')
  fireEvent.click(removeButton)
  expect(mockSet).toBeCalledWith([])
})
