import React from 'react'
import { fireEvent } from '@testing-library/react'
import { actRender } from '../test/utilities'
import categoryService from '../services/category'
import Filter from './Filter'

jest.mock('../services/category.js')
const testCategories = [{ id: 1, name: 'pizza' }, { id: 2, name: 'burger' }, { id: 3, name: 'salads' }]

categoryService.getAll.mockResolvedValue([...testCategories])

test('filter list exists', async () => {
  const { queryByTestId } = await actRender(
    <Filter
      filterCategories={[...testCategories]}
      setFilterCategories={jest.fn()}
      emptyMessage={<strong>#NoFilter</strong>}
    />
  )
  const listElement = queryByTestId('filter-list')
  expect(listElement).toBeInTheDocument()
})

test('filter dropdown exists', async () => {
  const { queryByTestId } = await actRender(
    <Filter
      filterCategories={[...testCategories]}
      setFilterCategories={jest.fn()}
      emptyMessage={<strong>#NoFilter</strong>}
    />
  )
  const dropdownElement = queryByTestId('filter-dropdown')
  expect(dropdownElement).toBeInTheDocument()
})

test('when deletebutton is pressed, setFilterCategories is called with right value', async () => {
  const mockSet = jest.fn()
  const { queryByTestId } = await actRender(
    <Filter
      filterCategories={[{ id: 3, name: 'salads' }]}
      setFilterCategories={mockSet}
      emptyMessage={<strong>#NoFilter</strong>}
    />
  )
  const removeButton = queryByTestId('filter-listEntry-deleteButton')
  fireEvent.click(removeButton)
  expect(mockSet).toBeCalledWith([])
})
