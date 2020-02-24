import React from 'react'
import { fireEvent, within } from '@testing-library/react'
import ListEntry from './ListEntry'

import { actRender } from '../../test/utilities'

jest.mock('../../services/category.js')

const testItem = {
  name: 'Pizza',
  id: 13
}

test('renders item name', async () => {
  const { getByTestId } = await actRender(
    <ListEntry item={testItem} />,
    ['/admin/categories']
  )

  const label = within(getByTestId('list-entry')).getByTestId('label')
  expect(label).toBeInTheDocument()
})

test('renders delete button when onClickRemove is provided', async () => {
  const { getByTestId } = await actRender(
    <ListEntry item={testItem} onClickRemove={jest.fn()} />,
    ['/admin/categories']
  )

  const deleteButton = within(getByTestId('list-entry')).getByRole('remove-button')
  expect(deleteButton).toBeInTheDocument()
})

test('does not render delete button when onClickRemove is not defined', async () => {
  const { getByTestId } = await actRender(
    <ListEntry item={testItem} />,
    ['/admin/categories']
  )

  const deleteButton = within(getByTestId('list-entry')).queryByRole('remove-button')
  expect(deleteButton).not.toBeInTheDocument()
})

test('renders edit button when onClickEdit is provided', async () => {
  const { getByTestId } = await actRender(
    <ListEntry item={testItem} onClickEdit={jest.fn()} />,
    ['/admin/categories']
  )

  const editButton = within(getByTestId('list-entry')).getByRole('edit-button')
  expect(editButton).toBeInTheDocument()
})

test('does not render edit button when onClickEdit is not defined', async () => {
  const { getByTestId } = await actRender(
    <ListEntry item={testItem} />,
    ['/admin/categories']
  )

  const editButton = within(getByTestId('list-entry')).queryByRole('edit-button')
  expect(editButton).not.toBeInTheDocument()
})

test('pressing the delete button calls the provided callback', async () => {
  const mockOnRemove = jest.fn()
  const { getByTestId } = await actRender(
    <ListEntry item={testItem} onClickRemove={mockOnRemove} />,
    ['/admin/categories']
  )

  const deleteButton = within(getByTestId('list-entry')).queryByRole('remove-button')
  fireEvent.click(deleteButton)
  expect(mockOnRemove).toBeCalledWith(testItem)
})

test('pressing the delete button calls the provided callback', async () => {
  const mockOnEdit = jest.fn()
  const { getByTestId } = await actRender(
    <ListEntry item={testItem} onClickEdit={mockOnEdit} />,
    ['/admin/categories']
  )

  const editButton = within(getByTestId('list-entry')).queryByRole('edit-button')
  fireEvent.click(editButton)
  expect(mockOnEdit).toBeCalledWith(testItem)
})
