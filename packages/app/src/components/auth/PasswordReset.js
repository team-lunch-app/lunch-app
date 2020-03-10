import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import authService from '../../services/authentication'

const PasswordReset = ({ reset = false }) => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const history = useHistory()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await authService.changePassword(oldPassword, newPassword)
      history.push('/admin')
    } catch (error) {
      setError(error.response.data.error)
      setNewPassword('')
      setOldPassword('')
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit} data-testid='reset-password-form'>
        {reset
          ? <>
            <h1>Uh oh! Password reset needed!</h1>
            <p>
              Either you are logging in for the first time, or your password has expired. Please provide a new password.
            </p>
          </>
          : <>
            <h1>Change password</h1>
          </>
        }
        <Form.Group data-testid='old-password-field'>
          <Form.Label >Old Password</Form.Label>
          <Form.Control
            type='password'
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            placeholder='Your old password' />
        </Form.Group>
        <Form.Group data-testid='new-password-field'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type='password'
            value={newPassword}
            onChange={(event) => { setNewPassword(event.target.value) }}
            placeholder='New Password' />
        </Form.Group>
        {error && <Alert data-testid='error-msg-generic' variant='danger'>{error}</Alert>}
        <Button data-testid='submit-button' type='submit'>Change password</Button>
      </Form>
    </>
  )
}

PasswordReset.propTypes = {
  reset: PropTypes.bool,
}

export default PasswordReset
