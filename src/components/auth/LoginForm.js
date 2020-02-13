import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import authService from '../../services/authentication'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    const response = await authService.login(username, password)
    
    // ERROR HANDLING & MESSAGES
  }

  return (
    <>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label data-testid='loginform-usernameLabel'>Username</Form.Label>
          <Form.Control
            data-testid='loginform-usernameField'
            type='text'
            onChange={(event) => setUsername(event.target.value)}
            placeholder='Your Username' />
        </Form.Group>
        <Form.Group>
          <Form.Label data-testid='loginform-passwordLabel'>Password</Form.Label>
          <Form.Control
            data-testid='loginform-passwordField'
            type='password'
            onChange={(event) => {setPassword(event.target.value)}}
            placeholder='****************' />
        </Form.Group>
        <Button data-testid='loginform-loginButton' type='submit'>Log In</Button>
      </Form>
    </>
  )
}

export default LoginForm
