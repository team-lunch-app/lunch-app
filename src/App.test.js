import React from 'react'
import { fireEvent, waitForElement, wait } from '@testing-library/react'
import { actRender } from './test/utilities'
import App from './App'
import restaurantService from './services/restaurant'
import categoryService from './services/category'
import authService from './services/authentication'
import suggestionService from './services/suggestion'

jest.mock('./services/restaurant.js')
jest.mock('./services/authentication.js')
jest.mock('./services/category.js')

jest.mock('./services/suggestion.js')

beforeEach(() => {
  jest.clearAllMocks()
  authService.getToken.mockReturnValue(undefined)
  restaurantService.getAll.mockResolvedValue([])
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])
  suggestionService.getAll.mockResolvedValue([])
})

test('randomizer exists initially', async () => {
  const { queryByTestId } = await actRender(<App />, ['/'])
  const randomizer = queryByTestId('randomizer')
  expect(randomizer).toBeInTheDocument()
})

test('add form is hidden initially', async () => {
  const { queryByTestId } = await actRender(<App />, ['/'])
  const form = queryByTestId('addForm')
  expect(form).not.toBeInTheDocument()
})

test('addForm component is rendered when button is pressed', async () => {
  const { queryByTestId, getByTestId } = await actRender(<App />, ['/'])

  const button = queryByTestId('addForm-link')
  fireEvent.click(button)
  const form = await waitForElement(() => getByTestId('addForm'))
  expect(form).toBeInTheDocument()
})

test('listing is hidden initially', async () => {
  const { queryByTestId } = await actRender(<App />, ['/'])
  const list = queryByTestId('restaurantList')
  expect(list).not.toBeInTheDocument()
})

test('restaurantList component is rendered when list button is pressed', async () => {
  const { queryByTestId, getByTestId } = await actRender(<App />, ['/'])

  const button = queryByTestId('restaurantList-link')
  fireEvent.click(button)

  const list = await waitForElement(() => getByTestId('restaurantList'))
  expect(list).toBeInTheDocument()
})

describe('when not logged in', () => {
  test('navigating to /admin redirects to /login', async () => {
    authService.getToken.mockReturnValue(undefined)

    const { getPath } = await actRender(<App />, ['/admin'])
    expect(getPath().pathname).toBe('/login')
  })
  test('logout button will not be rendered', async () => {
    authService.getToken.mockReturnValue(undefined)

    const { queryByTestId } = await actRender(<App />, ['/admin/suggestions'])
    const button = queryByTestId('logout-button')
    expect(button).not.toBeInTheDocument()
  })
})

describe('when logged in as an administrator', () => {
  test('navigating to /login redirects to /admin/suggestions', async () => {
    authService.getToken.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNDUzYmFlNjZiYjNkMjUxZGMwM2U5YyIsInVzZXJuYW1lIjoiTWFrZSIsImlhdCI6MTU4MTU5OTg5MX0.0BDsns4hxWvMguZq8llaB3gMTvPNDkDhPkl7mCYl928')

    const { getPath } = await actRender(<App />, ['/login'])
    expect(getPath().pathname).toBe('/admin/suggestions')
  })

  test('logout button will be rendered', async () => {
    authService.getToken.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNDUzYmFlNjZiYjNkMjUxZGMwM2U5YyIsInVzZXJuYW1lIjoiTWFrZSIsImlhdCI6MTU4MTU5OTg5MX0.0BDsns4hxWvMguZq8llaB3gMTvPNDkDhPkl7mCYl928')
  
    const { queryByTestId } = await actRender(<App />, ['/admin/suggestions'])
    const button = queryByTestId('logout-button')
    expect(button).toBeInTheDocument()
  })

  test('logout button will call logout', async () => {
    authService.getToken.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNDUzYmFlNjZiYjNkMjUxZGMwM2U5YyIsInVzZXJuYW1lIjoiTWFrZSIsImlhdCI6MTU4MTU5OTg5MX0.0BDsns4hxWvMguZq8llaB3gMTvPNDkDhPkl7mCYl928')

    const { queryByTestId, getPath } = await actRender(<App />, ['/admin/suggestions'])
    const button = queryByTestId('logout-button')
    fireEvent.click(button)

    await wait(() => expect(authService.logout).toHaveBeenCalled())
    await wait(() => expect(getPath().pathname).toBe('/'))
  })
})
