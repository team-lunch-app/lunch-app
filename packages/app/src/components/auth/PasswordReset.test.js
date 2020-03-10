import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
import { within } from '@testing-library/dom'
import { actRender } from '../../test/utilities'
import PasswordReset from './PasswordReset'
import authService from '../../services/authentication'
import { act } from 'react-dom/test-utils'

jest.mock('../../services/authentication.js')


beforeEach(() => {
  jest.clearAllMocks()
  authService.changePassword.mockRejectedValue({ message: 'foobar' })
})

test('old password field is rendered', async () => {
  const { getByTestId } = await actRender(<PasswordReset />, ['/password-reset'])

  const form = getByTestId(/reset-password-form/i)
  const field = within(form).getByTestId(/old-password-field/i)
  expect(field).toBeInTheDocument()
})

test('new password field is rendered', async () => {
  const { getByTestId } = await actRender(<PasswordReset />, ['/password-reset'])

  const form = getByTestId(/reset-password-form/i)
  const field = within(form).getByTestId(/new-password-field/i)
  expect(field).toBeInTheDocument()
})

test('when credentials are accepted, user is redirected to /admin', async () => {
  authService.changePassword.mockResolvedValue()
  const { getByTestId, getPath } = await actRender(<PasswordReset />, ['/password-reset'])

  const form = getByTestId(/reset-password-form/i)
  const oldPasswordField = within(within(form).getByTestId(/old-password-field/i)).getByRole(/textbox/i)
  fireEvent.change(oldPasswordField, { target: { value: 'KissaKoira123' } })
  const newPasswordField = within(within(form).getByTestId(/new-password-field/i)).getByRole(/textbox/i)
  fireEvent.change(newPasswordField, { target: { value: 'KoiraKissa987' } })

  const submitButton = within(form).getByTestId(/submit-button/i)
  await act(async () => fireEvent.click(submitButton))


  expect(getPath().pathname).toBe('/admin')
})

test('when credentials are accepted, changePassword is called', async () => {
  authService.changePassword.mockResolvedValue()
  const { getByTestId, getPath } = await actRender(<PasswordReset />, ['/password-reset'])

  const form = getByTestId(/reset-password-form/i)
  const oldPasswordField = within(within(form).getByTestId(/old-password-field/i)).getByRole(/textbox/i)
  fireEvent.change(oldPasswordField, { target: { value: 'KissaKoira123' } })
  const newPasswordField = within(within(form).getByTestId(/new-password-field/i)).getByRole(/textbox/i)
  fireEvent.change(newPasswordField, { target: { value: 'KoiraKissa987' } })

  const submitButton = within(form).getByTestId(/submit-button/i)
  await act(async () => fireEvent.click(submitButton))


  expect(authService.changePassword).toBeCalledWith('KissaKoira123', 'KoiraKissa987')
})

test('when credentials are rejected, error is displayed', async () => {
  authService.changePassword.mockRejectedValue({ response: { data: { error: 'password too short' } } })
  const { getByTestId, getPath } = await actRender(<PasswordReset />, ['/password-reset'])

  const form = getByTestId(/reset-password-form/i)
  const oldPasswordField = within(within(form).getByTestId(/old-password-field/i)).getByRole(/textbox/i)
  fireEvent.change(oldPasswordField, { target: { value: 'KissaKoira123' } })
  const newPasswordField = within(within(form).getByTestId(/new-password-field/i)).getByRole(/textbox/i)
  fireEvent.change(newPasswordField, { target: { value: 'KoiraKissa987' } })

  const submitButton = within(form).getByTestId(/submit-button/i)
  await act(async () => fireEvent.click(submitButton))

  const error = within(form).queryByTestId(/error-msg-generic/i)


  expect(error).toHaveTextContent(/password too short/i)
})

