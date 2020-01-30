import React from 'react'
import { render, fireEvent, waitForDomChange } from '@testing-library/react'
import FilterDropdown from './FilterDropdown'

const testCategories = [{ id: 1, name: 'pizza' }, { id: 2, name: 'burger' }, { id: 3, name: 'salads' }]

test('dropdown has correct amount of entries', () => {
  const { queryAllByTestId } = render(<FilterDropdown onAdd={jest.fn()} />)
  const dropdownEntries = queryAllByTestId('filter-dropdownEntry')
  expect(dropdownEntries.length).toBe(3)
})
