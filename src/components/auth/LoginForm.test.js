import React from 'react'
import { fireEvent, waitForElement } from '@testing-library/react'
import { within } from '@testing-library/dom'
import { actRender } from '../../test/utilities'
import LoginForm from './LoginForm'
import authService from '../../services/authentication'
import { MemoryRouter } from 'react-router-dom'


jest.mock('../../services/authentication.js')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('form is rendered', () => {
  test('labels for username and password are rendered', async () => {
    const { queryByTestId } = await actRender(
      <MemoryRouter initialEntries={['/login']}>
        <LoginForm />
      </MemoryRouter>
    )

    const usernameLabel = within(queryByTestId(/loginForm-usernameField/i)).getByText(/username/i)
    expect(usernameLabel).toBeInTheDocument()
    const passwordLabel = within(queryByTestId(/loginForm-passwordField/i)).getByText(/password/i)
    expect(passwordLabel).toBeInTheDocument()
  })

  test('field for username is rendered', async () => {
    const { queryByTestId } = await actRender(
      <MemoryRouter initialEntries={['/login']}>
        <LoginForm />
      </MemoryRouter>
    )

    const userNameField = queryByTestId(/loginForm-usernameField/i)
    expect(userNameField).toBeInTheDocument()
  })

  test('field for password is rendered', async () => {
    const { queryByTestId } = await actRender(
      <MemoryRouter initialEntries={['/login']}>
        <LoginForm />
      </MemoryRouter>
    )

    const passwordField = queryByTestId(/loginForm-passwordField/i)
    expect(passwordField).toBeInTheDocument()
  })

  test('login button is rendered', async () => {
    const { queryByTestId } = await actRender(
      <MemoryRouter initialEntries={['/login']}>
        <LoginForm />
      </MemoryRouter>
    )

    const loginButton = queryByTestId(/loginForm-loginButton/i)
    expect(loginButton).toBeInTheDocument()
  })
})

test('clicking the login button calls the authentication service with the inputted username and password', async () => {
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/login']}>
      <LoginForm />
    </MemoryRouter>
  )

  const userNameField = within(queryByTestId(/loginForm-usernameField/i)).queryByRole(/textbox/i)
  fireEvent.change(userNameField, { target: { value: 'PostItMaster' } })

  const passwordField = within(queryByTestId(/loginForm-passwordField/i)).queryByRole(/textbox/i)
  fireEvent.change(passwordField, { target: { value: 'TheSecurestPassword' } })

  const loginButton = queryByTestId(/loginForm-loginButton/i)
  fireEvent.click(loginButton)
  expect(authService.login).toBeCalledWith('PostItMaster', 'TheSecurestPassword')
})

test('error message is shown if login fails', async () => {
  const { queryByTestId, getByTestId } = await actRender(
    <MemoryRouter initialEntries={['/login']}>
      <LoginForm onSubmit={jest.fn()} />
    </MemoryRouter>
  )

  authService.login.mockRejectedValue({ message: 'foobar' })

  const buttonElement = await queryByTestId(/loginForm-loginButton/i)
  fireEvent.click(buttonElement)

  const error = await waitForElement(() => getByTestId(/loginForm-error/i))
  expect(error).toBeInTheDocument()
})
