import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import authService from '../../services/authentication'

import './LoginForm.css'

const LoginForm = ({ changeLoginStatus }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const history = useHistory()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const { passwordExpired } = await authService.login(username, password)
      history.push(passwordExpired
        ? '/admin/password-reset'
        : '/admin')
      changeLoginStatus(true)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <>
      <Form className="loginform" onSubmit={handleLogin}>
        <Form.Group data-testid='loginform-usernameField'>
          <Form.Label >Username</Form.Label>
          <Form.Control
            role='textbox'
            type='text'
            onChange={(event) => setUsername(event.target.value)}
            placeholder='Your Username' />
        </Form.Group>
        <Form.Group data-testid='loginform-passwordField'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            role='textbox'
            type='password'
            onChange={(event) => { setPassword(event.target.value) }}
            placeholder='****************' />
        </Form.Group>
        {error && <Alert data-testid='loginForm-error' variant='danger'>Invalid username or password! </Alert>}
        <Button data-testid='loginform-loginButton' type='submit'>Log In</Button>
      </Form>
    </>
  )
}

LoginForm.propTypes = {
  changeLoginStatus: PropTypes.func
}

export default LoginForm
