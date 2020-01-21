import React from 'react'
import { act, render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
import App from './App'
import restaurantService from './services/restaurant'
import { MemoryRouter } from 'react-router-dom'

jest.mock('./services/restaurant.js')
restaurantService.getAll.mockResolvedValue([])

test('randomizer exists initially', () => {
  const { queryByTestId } = render(<MemoryRouter><App /></MemoryRouter>)
  const randomizer = queryByTestId('randomizer')
  expect(randomizer).toBeInTheDocument()
})

test('add form is hidden initially', () => {
  const { queryByTestId } = render(<MemoryRouter><App /></MemoryRouter>)
  const form = queryByTestId('addForm')
  expect(form).not.toBeInTheDocument()
})

test('addForm component is rendered when button is pressed', () => {
  const { queryByTestId } = render(<MemoryRouter><App /></MemoryRouter>)
  const button = queryByTestId('addForm-link')
  fireEvent.click(button)
  const form = queryByTestId('addForm')
  expect(form).toBeInTheDocument()
})

test('listing is hidden initially', () => {
  const { queryByTestId } = render(<MemoryRouter><App /></MemoryRouter>)
  const list = queryByTestId('restaurantList')
  expect(list).not.toBeInTheDocument()
})

test('restaurantList component is rendered when list button is pressed', async () => {
  await act(async () => {
    const { queryByTestId, getByTestId } = render(<MemoryRouter><App /></MemoryRouter>)
    const button = queryByTestId('restaurantList-link')
    fireEvent.click(button)

    await waitForElementToBeRemoved(() => getByTestId('randomizer'))
    const list = await queryByTestId('restaurantList')
    expect(list).toBeInTheDocument()
  })
})
