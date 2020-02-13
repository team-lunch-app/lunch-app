import React from 'react'
import { fireEvent, wait, waitForElement } from '@testing-library/react'
import { within } from '@testing-library/dom'
import { actRender } from '../test/utilities'
import AddForm from './AddForm'
import restaurantService from '../services/restaurant'
import categoryService from '../services/category'
import { MemoryRouter, Route } from 'react-router-dom'

jest.mock('../services/restaurant.js')
jest.mock('../services/category.js')

beforeEach(() => {
  jest.clearAllMocks()
  categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])
})


describe('form alerts', () => {
  test('name error message is hidden by default', async () => {
    const { queryByTestId } = await actRender(
      <MemoryRouter initialEntries={['/add']}>
        <AddForm onSubmit={jest.fn()} />
      </MemoryRouter>
    )

    const { queryByRole } = within(queryByTestId('addForm-nameField'))
    const error = queryByRole(/alert/i)
    expect(error).not.toBeInTheDocument()
  })

  test('invalid name input displays an error message', async () => {
    const { queryByTestId } = await actRender(
      <MemoryRouter initialEntries={['/add']}>
        <AddForm onSubmit={jest.fn()} />
      </MemoryRouter>
    )

    const buttonElement = await queryByTestId('addForm-addButton')
    fireEvent.click(buttonElement)

    const error = await waitForElement(() => within(queryByTestId('addForm-nameField')).getByRole(/alert/i))
    expect(error).toBeInTheDocument()
  })

  test('url error message is hidden by default', async () => {
    const { queryByTestId } = await actRender(
      <MemoryRouter initialEntries={['/add']}>
        <AddForm onSubmit={jest.fn()} />
      </MemoryRouter>
    )

    const { queryByRole } = within(queryByTestId('addForm-urlField'))
    const error = queryByRole(/alert/i)
    expect(error).not.toBeInTheDocument()
  })

  test('invalid url input displays an error message', async () => {
    const { queryByTestId } = await actRender(
      <MemoryRouter initialEntries={['/add']}>
        <AddForm onSubmit={jest.fn()} />
      </MemoryRouter>
    )

    const buttonElement = await queryByTestId('addForm-addButton')
    fireEvent.click(buttonElement)

    const error = await waitForElement(() => within(queryByTestId('addForm-urlField')).getByRole(/alert/i))
    expect(error).toBeInTheDocument()
  })
})

test('add button calls restaurant callback with correct arguments', async () => {
  const mockSubmit = jest.fn()
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/add']}>
      <AddForm onSubmit={mockSubmit} />
    </MemoryRouter>
  )

  // Input test data
  const nameElement = within(queryByTestId('addForm-nameField')).getByRole(/textbox/i)
  fireEvent.change(nameElement, { target: { value: 'Lidl City Center' } })
  const urlElement = within(queryByTestId('addForm-urlField')).getByRole(/textbox/i)
  fireEvent.change(urlElement, { target: { value: 'https://www.lidl.fi/' } })

  // Test that the restaurant service is called
  const buttonElement = await queryByTestId('addForm-addButton')
  fireEvent.click(buttonElement)

  await wait(() => expect(mockSubmit).toBeCalledWith({ name: 'Lidl City Center', url: 'https://www.lidl.fi/', categories: [] }))
})

test('form is closed after adding a restaurant', async () => {
  let path
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/add']}>
      <AddForm onSubmit={jest.fn()} />
      <Route path='*' render={({ location }) => { path = location; return null }} />
    </MemoryRouter>
  )

  // Input test data
  const nameElement = within(queryByTestId('addForm-nameField')).getByRole(/textbox/i)
  fireEvent.change(nameElement, { target: { value: 'Lidl City Center' } })
  const urlElement = within(queryByTestId('addForm-urlField')).getByRole(/textbox/i)
  fireEvent.change(urlElement, { target: { value: 'https://www.lidl.fi/' } })

  const buttonElement = queryByTestId('addForm-addButton')
  fireEvent.click(buttonElement)

  await wait(() => expect(path.pathname).toBe('/'))
})

test('pressing cancel hides the component', async () => {
  let path
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/add']}>
      <AddForm onSubmit={jest.fn()} />
      <Route path='*' render={({ location }) => { path = location; return null }} />
    </MemoryRouter>
  )

  // Hide the form
  const buttonElement = queryByTestId('addForm-cancelButton')
  fireEvent.click(buttonElement)

  await wait(() => expect(path.pathname).toBe('/'))
})

test('form is empty if restaurant is not found with the given id parameter', async () => {
  restaurantService.getOneById.mockRejectedValue({ message: 'Error.' })

  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/edit/1']}>
      <AddForm id={1} />
    </MemoryRouter>
  )

  const nameField = within(queryByTestId('addForm-nameField')).getByRole(/textbox/i)
  expect(nameField.value).toBe('')
})

test('form is pre-filled if a restaurant is found with the given id parameter', async () => {
  restaurantService.getOneById.mockResolvedValue(
    {
      name: 'Luigi\'s pizza',
      url: 'www.pizza.fi',
      id: 1,
      categories: [],
    }
  )

  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/edit/1']}>
      <AddForm id={1} />
    </MemoryRouter>
  )

  const nameField = within(queryByTestId('addForm-nameField')).getByRole(/textbox/i)
  const urlField = within(queryByTestId('addForm-urlField')).getByRole(/textbox/i)
  expect(nameField.value).toBe('Luigi\'s pizza')
  expect(urlField.value).toBe('www.pizza.fi')
})
