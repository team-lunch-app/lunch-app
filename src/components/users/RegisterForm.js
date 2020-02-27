import React, { useState } from 'react'
import { Form, Button, ButtonToolbar, Alert } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

const RegisterForm = ({ onSubmit }) => {
  const createDefaultUser = () => ({ username: '', password: '' })

  const [error, setError] = useState('')
  const [user, setUser] = useState(createDefaultUser())
  const setName = (username) => setUser({ ...user, username })
  const setPassword = (password) => setUser({ ...user, password })
  const { register, handleSubmit, errors } = useForm()

  let history = useHistory()

  const registerUser = async (data, event) => {
    event.preventDefault()

    try {
      if (onSubmit) {
        await onSubmit(user)
      }
      setError('')
      history.push('/admin/users')
    }
    catch (e) {
      setError(e.response.data.error)
    }
  }

  return (
    <div data-testid='register-form'>
      {error && <Alert role='alert' variant='danger'>{error}</Alert>}
      <Form onSubmit={handleSubmit(registerUser)} className='add-form'>
        <Form.Group data-testid='username-field'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            disabled={!user}
            type='text'
            name='name'
            defaultValue={user.name}
            onChange={(event) => setName(event.target.value)}
            ref={register({ required: true, minLength: 3, maxLength: 240 })} />
          {errors.name &&
            <Alert data-testid='categoryForm-nameErrorMessage' variant='danger'>
              {errors.name.type === 'required' && <li>Username cannot be empty!</li>}
              {errors.name.type === 'minLength' && <li>Must be at least 3 characters</li>}
              {errors.name.type === 'maxLength' && <li>Must be shorter than 240 characters</li>}
            </Alert>
          }
        </Form.Group>
        <Form.Group data-testid='password-field'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            disabled={!user}
            type='text'
            name='name'
            defaultValue={user.password}
            onChange={(event) => setPassword(event.target.value)}
            ref={register({ required: true, minLength: 3, maxLength: 240 })} />
          {errors.name &&
            <Alert data-testid='error-message' variant='danger'>
              {errors.name.type === 'required' && <li>Password cannot be empty!</li>}
              {errors.name.type === 'minLength' && <li>Must be at least 8 characters</li>}
              {errors.name.type === 'maxLength' && <li>Must be shorter than 240 characters</li>}
            </Alert>
          }
        </Form.Group>
        <ButtonToolbar>
          <Button
            data-testid='categoryForm-cancelButton'
            onClick={() => history.push('/admin/users')}
            variant='secondary'
          >
            Cancel
          </Button>
          <Button
            data-testid='submit'
            type='submit'
            variant='primary'
          >
            Register
          </Button>
        </ButtonToolbar>
      </Form>
    </div>
  )
}

RegisterForm.propTypes = {
  id: PropTypes.any,
  onSubmit: PropTypes.func,
}

export default RegisterForm
