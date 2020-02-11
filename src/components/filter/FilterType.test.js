import React from 'react'
import { fireEvent, waitForElement } from '@testing-library/react'
import FilterType from '../filter/FilterType'
import { actRender } from '../../test/utilities'

beforeEach(() => {
  jest.clearAllMocks()
})

test('is initially closed', async () => {

  const { queryByTestId } =
    await actRender(
      <FilterType filterType={'some'} setFilterType={jest.fn()} />
    )

  const categoryElements = queryByTestId('filtertype-dropdown-entry')
  expect(categoryElements).not.toBeInTheDocument()
})

test('does not have elements while hidden', async () => {

  const { queryByTestId } =
    await actRender(
      <FilterType filterType={'some'} setFilterType={jest.fn()} />
    )
  const dropdownElement = queryByTestId('filtertype-dropdown')
  expect(dropdownElement).not.toHaveClass('show')
})

test('dropdown is marked visible once shown', async () => {

  const { queryByTestId, getAllByTestId } =
    await actRender(
      <FilterType filterType={'some'} setFilterType={jest.fn()} />
    )

  const toggleElement = queryByTestId('filtertype-dropdown-toggle')
  fireEvent.click(toggleElement)

  await waitForElement(() => getAllByTestId('filtertype-dropdown-entry'))
  const dropdownElement = queryByTestId('filtertype-dropdown')
  expect(dropdownElement).toHaveClass('show')
})
