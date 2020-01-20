import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const AddForm = ({ restaurantService }) => {
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  let history = useHistory()

  const addRestaurant = (event) => {
    event.preventDefault()

    if (name && url) {
      restaurantService.add({ name, url })
      setName('')
      setUrl('')
      setError('')
      history.push('/')
    } else {
      setError('Name and/or URL cannot be empty!')
    }
  }

  return (
    <div>
      {error ? <Alert data-testid='addForm-errorMessage' variant='danger'>{error}</Alert> : null}
      <Form data-testid='addForm' onSubmit={(event) => addRestaurant(event)}>
        <Form.Group>
          <Form.Label>Restaurant Name</Form.Label>
          <Form.Control data-testid='addForm-nameField' type='text' value={name} onChange={(event) => setName(event.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Restaurant Website</Form.Label>
          <Form.Control data-testid='addForm-urlField' type='text' value={url} onChange={(event) => setUrl(event.target.value)} />
        </Form.Group>

        <Button data-testid='addForm-addButton' type='submit' variant='primary' block>Add</Button>

        <Button
          data-testid='addForm-cancelButton'
          onClick={() => history.push('/')}
          variant='secondary' block>
          Cancel
        </Button>
      </Form>
    </div>
  )
}

export default AddForm
