import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import authService from '../../services/authentication'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await authService.login(username, password)
    } catch (error) {
      setError(error.message)
    }

    // ERROR HANDLING & MESSAGES
  }

  return (
    <>
      <Form onSubmit={handleLogin}>
        <Form.Group data-testid='loginform-usernameField'>
          <Form.Label >Username</Form.Label>
          <Form.Control
            type='text'
            onChange={(event) => setUsername(event.target.value)}
            placeholder='Your Username' />
        </Form.Group>
        <Form.Group data-testid='loginform-passwordField'>
          <Form.Label>Password</Form.Label>
          <Form.Control
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

export default LoginForm
