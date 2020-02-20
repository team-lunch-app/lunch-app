import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import FilterList from './FilterList'

const testCategories = [{ id: 1, name: 'pizza' }, { id: 2, name: 'burger' }, { id: 3, name: 'salads' }]

test('if no filter is selected, no entries are rendered', () => {
  const { queryByTestId } = render(<FilterList selected={[]} onRemove={jest.fn()} emptyMessage={<strong>#NoFilter</strong>} />)
  const listEntry = queryByTestId('filter-listEntry')
  expect(listEntry).not.toBeInTheDocument()
})

test('if no filter is selected, message is rendered', () => {
  const { queryByTestId } = render(<FilterList selected={[]} onRemove={jest.fn()} emptyMessage={<strong>#NoFilter</strong>} />)
  const messageEntry = queryByTestId('filter-emptyMessage')
  expect(messageEntry).toBeInTheDocument()
})

test('if 3 filters are selected, 3 entries are rendered', () => {
  const { queryAllByTestId } = render(<FilterList selected={[...testCategories]} onRemove={jest.fn()} emptyMessage={<strong>#NoFilter</strong>} />)
  const listEntries = queryAllByTestId('filter-listEntry')
  expect(listEntries.length).toBe(3)
})

test('if a filter is selected, its name is rendered', () => {
  const { getByText } = render(<FilterList selected={[{ id: 3, name: 'salads'}]} onRemove={jest.fn()} emptyMessage={<strong>#NoFilter</strong>} />)
  const entry = getByText(/salads/i)
  expect(entry).toBeInTheDocument()
})

test('if a filter is selected, it has a remove button', () => {
  const { queryByTestId } = render(<FilterList selected={[{ id: 3, name: 'salads'}]} onRemove={jest.fn()} emptyMessage={<strong>#NoFilter</strong>} />)
  const removeButton = queryByTestId('filter-listEntry-deleteButton')
  const entry = queryByTestId('filter-listEntry')
  expect(entry).toContainElement(removeButton)
})

test('when deletebutton is pressed, onRemove is called', () => {
  const deleteFunction = jest.fn()
  const { queryByTestId } = render(<FilterList selected={[{ id: 3, name: 'salads'}]} onRemove={deleteFunction} emptyMessage={<strong>#NoFilter</strong>} />)
  const removeButton = queryByTestId('filter-listEntry-deleteButton')
  fireEvent.click(removeButton)
  expect(deleteFunction).toBeCalled()
})

test('when deletebutton is pressed, onRemove is called with right value', () => {
  const deleteFunction = jest.fn()
  const { queryByTestId } = render(<FilterList selected={[{ id: 3, name: 'salads'}]} onRemove={deleteFunction} emptyMessage={<strong>#NoFilter</strong>} />)
  const removeButton = queryByTestId('filter-listEntry-deleteButton')
  fireEvent.click(removeButton)
  expect(deleteFunction).toBeCalledWith(3)
})


