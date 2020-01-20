import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'

const AddForm = ({ restaurantService }) => {
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const addRestaurant = (event) => {
    event.preventDefault()

    if (name && url) {
      restaurantService.add(name, url)
      setName('')
      setUrl('')
      setError('')
      setVisible(!visible)
    } else {
      setError('Name and/or URL cannot be empty!')
    }
  }

  const form = () => {
    return (
      <div>
        {error ? <Alert data-testid='addForm-errorMessage' variant='danger'>{error}</Alert> : null}
        <Form data-testid='addForm' onSubmit={(event) => addRestaurant(event)}>
          <Form.Group>
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control data-testid='addForm-nameField' type='text' onChange={(event) => setName(event.target.value)} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Restaurant Website</Form.Label>
            <Form.Control data-testid='addForm-urlField' type='text' onChange={(event) => setUrl(event.target.value)} />
          </Form.Group>

          <Button data-testid='addForm-addButton' type='submit' variant='primary' block>Add</Button>
          <Button data-testid='addForm-cancelButton' onClick={() => setVisible(!visible)} variant='secondary' block>Cancel</Button>
        </Form>
      </div>
    )
  }

  const button = () => {
    return (
      <Button data-testid='visibilityToggle' onClick={() => setVisible(!visible)}>+</Button>
    )
  }

  return (
    <div>
      {visible ? form() : button()}
    </div>
  )
}

export default AddForm
