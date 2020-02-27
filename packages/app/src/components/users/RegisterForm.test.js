import React from 'react'
import { within, fireEvent, wait, waitForElement } from '@testing-library/react'
import RegisterForm from './RegisterForm'

import { actRender } from '../../test/utilities'
import { act } from 'react-dom/test-utils'

beforeEach(async () => {
  jest.clearAllMocks()
})

test('username error message is hidden by default', async () => {
  const { queryByTestId } = await actRender(<RegisterForm onSubmit={jest.fn()} />, ['/admin/users/register'])

  const error = within(within(queryByTestId(/register-form/i)).queryByTestId(/username-field/i)).queryByRole(/alert/i)
  expect(error).not.toBeInTheDocument()
})

test('invalid name input displays an error message', async () => {
  const { getByTestId } = await actRender(<RegisterForm onSubmit={jest.fn()} />, ['/admin/users/register'])

  const form = getByTestId(/register-form/i)
  const buttonElement = within(form).getByTestId(/submit/i)
  fireEvent.click(buttonElement)

  const error = await waitForElement(() => within(within(form).getByTestId(/username-field/i)).getByRole(/alert/i))
  expect(error).toBeInTheDocument()
})

test('password error message is hidden by default', async () => {
  const { queryByTestId } = await actRender(<RegisterForm onSubmit={jest.fn()} />, ['/admin/users/register'])

  const error = within(within(queryByTestId(/register-form/i)).queryByTestId(/password-field/i)).queryByRole(/alert/i)
  expect(error).not.toBeInTheDocument()
})

test('invalid password input displays an error message', async () => {
  const { getByTestId } = await actRender(<RegisterForm onSubmit={jest.fn()} />, ['/admin/users/register'])

  const form = getByTestId(/register-form/i)

  const buttonElement = within(form).getByTestId(/submit/i)
  fireEvent.click(buttonElement)

  const error = await waitForElement(() => within(within(form).getByTestId(/password-field/i)).getByRole(/alert/i))
  expect(error).toBeInTheDocument()
})

test('submit after valid input redirects to the user list', async () => {
  const { getByTestId, getPath } = await actRender(<RegisterForm onSubmit={jest.fn()} />, ['/admin/users/register'])

  const form = getByTestId(/register-form/i)
  const usernameElement = within(within(form).getByTestId(/username-field/i)).getByRole(/textbox/i)
  const passwordElement = within(within(form).getByTestId(/password-field/i)).getByRole(/textbox/i)
  fireEvent.change(usernameElement, { target: { value: 'newuser' } })
  fireEvent.change(passwordElement, { target: { value: 'sekretabc123' } })

  const buttonElement = within(form).getByTestId(/submit/i)
  fireEvent.click(buttonElement)

  await wait(() => expect(getPath().pathname).toBe('/admin/users'))
})

test('submit after valid input calls submit callback with correct valeues', async () => {
  const mockSubmit = jest.fn()
  const { getByTestId } = await actRender(<RegisterForm onSubmit={mockSubmit} />, ['/admin/users/register'])

  const form = getByTestId(/register-form/i)
  const usernameElement = within(within(form).getByTestId(/username-field/i)).getByRole(/textbox/i)
  const passwordElement = within(within(form).getByTestId(/password-field/i)).getByRole(/textbox/i)
  fireEvent.change(usernameElement, { target: { value: 'newuser' } })
  fireEvent.change(passwordElement, { target: { value: 'sekretabc123' } })

  await act(async () => {
    const buttonElement = within(form).getByTestId(/submit/i)
    fireEvent.click(buttonElement)
  })

  expect(mockSubmit).toHaveBeenCalledWith({ username: 'newuser', password: 'sekretabc123' })
})

