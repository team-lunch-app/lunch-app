import React from 'react'
import { fireEvent, waitForElement } from '@testing-library/react'
import CategoryDropdown from './CategoryDropdown'
import { actRender } from '../test/utilities'
import categoryService from '../services/categoryServiceStub'

jest.mock('../services/categoryServiceStub.js')
const testCategories = [{ id: 1, name: 'pizza' }, { id: 2, name: 'burger' }, { id: 3, name: 'salads' }]

beforeEach(() => {
  jest.clearAllMocks()
})

test('is initially closed', async () => {
  categoryService.getAll.mockResolvedValue([...testCategories])
  const mockAdd = jest.fn()
  const mockRemove = jest.fn()

  const { queryByTestId } = await actRender(<CategoryDropdown selected={[]} onRemove={mockRemove} onAdd={mockAdd} />)

  const categoryElements = queryByTestId('category-dropdown-entry')
  expect(categoryElements).not.toBeInTheDocument()
})

test('does not have elements while hidden', async () => {
  categoryService.getAll.mockResolvedValue([...testCategories])
  const mockAdd = jest.fn()
  const mockRemove = jest.fn()

  const { queryByTestId } = await actRender(<CategoryDropdown selected={[]} onRemove={mockRemove} onAdd={mockAdd} />)

  const dropdownElement = queryByTestId('category-dropdown')
  expect(dropdownElement).not.toHaveClass('show')
})

test('dropdown is marked visible once shown', async () => {
  categoryService.getAll.mockResolvedValue([...testCategories])
  const mockAdd = jest.fn()
  const mockRemove = jest.fn()

  const { getAllByTestId, queryByTestId } = await actRender(<CategoryDropdown selected={[]} onRemove={mockRemove} onAdd={mockAdd} />)

  const toggleElement = queryByTestId('category-dropdown-toggle')
  fireEvent.click(toggleElement)

  await waitForElement(() => getAllByTestId('category-dropdown-entry'))
  const dropdownElement = queryByTestId('category-dropdown')
  expect(dropdownElement).toHaveClass('show')
})

test('dropdown has correct amount of entries once open', async () => {
  categoryService.getAll.mockResolvedValue([...testCategories])
  const mockAdd = jest.fn()
  const mockRemove = jest.fn()

  const { getAllByTestId, queryByTestId } = await actRender(<CategoryDropdown selected={[]} onRemove={mockRemove} onAdd={mockAdd} />)

  const toggleElement = queryByTestId('category-dropdown-toggle')
  fireEvent.click(toggleElement)

  
  const categoryElements = await waitForElement(() => getAllByTestId('category-dropdown-entry'))
  expect(categoryElements).toHaveLength(3)
})

test('onAdd is called with the correct category when clicking an unselected entry', async () => {
  categoryService.getAll.mockResolvedValue([...testCategories])

  const selected = [
    testCategories[0],
    testCategories[2],
  ]

  const mockAdd = jest.fn()
  const mockRemove = jest.fn()

  const { queryByTestId, getByText } = await actRender(<CategoryDropdown selected={selected} onRemove={mockRemove} onAdd={mockAdd} />)

  const toggleElement = queryByTestId('category-dropdown-toggle')
  fireEvent.click(toggleElement)

  
  const categoryElement = await waitForElement(() => getByText(/burger/i))
  fireEvent.click(categoryElement)
  expect(mockAdd).toBeCalledWith(testCategories[1])
})

test('onRemoved is called with the correct category when clicking a selected entry', async () => {
  categoryService.getAll.mockResolvedValue([...testCategories])

  const selected = [
    testCategories[0],
    testCategories[2],
  ]

  const mockAdd = jest.fn()
  const mockRemove = jest.fn()

  const { queryByTestId, getByText } = await actRender(<CategoryDropdown selected={selected} onRemove={mockRemove} onAdd={mockAdd} />)

  const toggleElement = queryByTestId('category-dropdown-toggle')
  fireEvent.click(toggleElement)

  
  const categoryElement = await waitForElement(() => getByText(/salads/i))
  fireEvent.click(categoryElement)
  expect(mockRemove).toBeCalledWith(testCategories[2].id)
})
