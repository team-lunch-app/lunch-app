import React from 'react'
import { fireEvent, wait, waitForElement, waitForDomChange } from '@testing-library/react'
import { actRender } from '../../test/utilities'
import LoginForm from './LoginForm'
import authService from '../../services/authentication'
import { MemoryRouter, Route } from 'react-router-dom'
import { fail } from 'assert'

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

    const usernameLabel = queryByTestId('loginform-usernameLabel')
    expect(usernameLabel).toBeInTheDocument()
    const passwordLabel = queryByTestId('loginform-passwordLabel')
    expect(passwordLabel).toBeInTheDocument()
  })

  test('field for username is rendered', async () => {
    const { queryByTestId } = await actRender(
      <MemoryRouter initialEntries={['/login']}>
        <LoginForm />
      </MemoryRouter>
    )

    const userNameField = queryByTestId('loginform-usernameField')
    expect(userNameField).toBeInTheDocument()
  })

  test('field for password is rendered', async () => {
    const { queryByTestId } = await actRender(
      <MemoryRouter initialEntries={['/login']}>
        <LoginForm />
      </MemoryRouter>
    )

    const passwordField = queryByTestId('loginform-passwordField')
    expect(passwordField).toBeInTheDocument()
  })

  test('login button is rendered', async () => {
    const { queryByTestId } = await actRender(
      <MemoryRouter initialEntries={['/login']}>
        <LoginForm />
      </MemoryRouter>
    )

    const loginButton = queryByTestId('loginform-loginButton')
    expect(loginButton).toBeInTheDocument()
  })
})

test('clicking the login button calls the authentication service with the inputted username and password', async () => {
  const { queryByTestId } = await actRender(
    <MemoryRouter initialEntries={['/login']}>
      <LoginForm />
    </MemoryRouter>
  )

  const userNameField = queryByTestId('loginform-usernameField')
  fireEvent.change(userNameField, { target: { value: 'PostItMaster' } })

  const passwordField = queryByTestId('loginform-passwordField')
  fireEvent.change(passwordField, { target: { value: 'TheSecurestPassword' } })

  const loginButton = queryByTestId('loginform-loginButton')
  fireEvent.click(loginButton)
  expect(authService).toBeCalledWith('PostItMaster', 'TheSecurestPassword')
})

test('error message is shown if login fails', async () => {
  fail('not implemented')
})

test('token remains undefined if login fails', () => {
  fail('not implemented')
})

test('clicking the login button calls the authentication service with the inputted username and password', () => {
  fail('not implemented')
})
