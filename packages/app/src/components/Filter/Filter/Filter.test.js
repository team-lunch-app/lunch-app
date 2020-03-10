import React from 'react'
import { fireEvent } from '@testing-library/react'
import { actRender } from '../../../test/utilities'
import categoryService from '../../../services/category'
import Filter from './Filter'

jest.mock('../../../services/category.js')
const testCategories = [{ id: 1, name: 'pizza' }, { id: 2, name: 'burger' }, { id: 3, name: 'salads' }]

categoryService.getAll.mockResolvedValue([...testCategories])
test('distancefilter and categorydropdown do not show by default', async () => {
  const { queryByTestId } = await actRender(
    <Filter
      filterCategories={[...testCategories]}
      setFilterCategories={jest.fn()}
      emptyMessage={<strong>#NoFilter</strong>}
      filterType={'some'}
      setFilterType={jest.fn()}
      showFilter={false}
      setDistance={jest.fn()}
    />
  )
  const dropdownElement = queryByTestId('filter-dropdown')
  expect(dropdownElement).not.toBeInTheDocument()
  const distanceElement = queryByTestId('filter-distance')
  expect(distanceElement).not.toBeInTheDocument()
})

test('filter list exists when opened', async () => {
  const { queryByTestId } = await actRender(
    <Filter
      filterCategories={[...testCategories]}
      setFilterCategories={jest.fn()}
      emptyMessage={<strong>#NoFilter</strong>}
      filterType={'some'}
      setFilterType={jest.fn()}
      showFilter={true}
      setDistance={jest.fn()}
    />
  )
  const listElement = queryByTestId('filter-list')
  expect(listElement).toBeInTheDocument()
})

test('filter dropdown exists when opened', async () => {
  const { queryByTestId } = await actRender(
    <Filter
      filterCategories={[...testCategories]}
      setFilterCategories={jest.fn()}
      emptyMessage={<strong>#NoFilter</strong>}
      filterType={'some'}
      setFilterType={jest.fn()}
      showFilter={true}
      setDistance={jest.fn()}
    />
  )
  const dropdownElement = queryByTestId('category-dropdown-toggle')
  expect(dropdownElement).toBeInTheDocument()
})

test('distance filter exists when opened', async () => {
  const { queryByTestId } = await actRender(
    <Filter
      filterCategories={[...testCategories]}
      setFilterCategories={jest.fn()}
      emptyMessage={<strong>#NoFilter</strong>}
      filterType={'some'}
      setFilterType={jest.fn()}
      showFilter={true}
      setDistance={jest.fn()}
    />
  )
  const distanceElement = queryByTestId('filter-distance')
  expect(distanceElement).toBeInTheDocument()
})

test('distance filter does not exist without a filtertype', async () => {
  const { queryByTestId } = await actRender(
    <Filter
      filterCategories={[...testCategories]}
      setFilterCategories={jest.fn()}
      emptyMessage={<strong>#NoFilter</strong>}
      filterType={undefined}
      setFilterType={jest.fn()}
      showFilter={true}
      setDistance={jest.fn()}
    />
  )
  const dropdownElement = queryByTestId('filter-distance')
  expect(dropdownElement).not.toBeInTheDocument()
})

test('when deletebutton is pressed, setFilterCategories is called with right value', async () => {
  const mockSet = jest.fn()
  const { queryByTestId } = await actRender(
    <Filter
      filterCategories={[{ id: 3, name: 'salads' }]}
      setFilterCategories={mockSet}
      emptyMessage={<strong>#NoFilter</strong>}
      filterType={'some'}
      setFilterType={jest.fn()}
      showFilter={true}
      setDistance={jest.fn()}
    />
  )
  const removeButton = queryByTestId('filter-listEntry-deleteButton')
  fireEvent.click(removeButton)
  expect(mockSet).toBeCalledWith([])
})
