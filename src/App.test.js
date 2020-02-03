import React from 'react'
import { fireEvent, waitForElement } from '@testing-library/react'
import { actRender } from './test/utilities'
import App from './App'
import restaurantService from './services/restaurant'
import { MemoryRouter } from 'react-router-dom'

jest.mock('./services/restaurant.js')
restaurantService.getAll.mockResolvedValue([])

test('randomizer exists initially', async () => {
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  )

  const randomizer = queryByTestId('randomizer')
  expect(randomizer).toBeInTheDocument()
})

test('add form is hidden initially', async () => {
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  )

  const form = queryByTestId('addForm')
  expect(form).not.toBeInTheDocument()
})

test('addForm component is rendered when button is pressed', async () => {
  const { queryByTestId, getByTestId } = await actRender(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  )

  const button = queryByTestId('addForm-link')
  fireEvent.click(button)
  const form = await waitForElement(() => getByTestId('addForm'))
  expect(form).toBeInTheDocument()
})

test('listing is hidden initially', async () => {
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  )

  const list = queryByTestId('restaurantList')
  expect(list).not.toBeInTheDocument()
})

test('restaurantList component is rendered when list button is pressed', async () => {
  const { queryByTestId, getByTestId } = await actRender(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  )

  const button = queryByTestId('restaurantList-link')
  fireEvent.click(button)

  const list = await waitForElement(() => getByTestId('restaurantList'))
  expect(list).toBeInTheDocument()
})
