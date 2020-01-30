import React, { useState, useEffect } from 'react'
import { Form, Button, ButtonToolbar, Alert } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import './AddForm.css'

const AddForm = ({ restaurantService }) => {
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [restaurant, setRestaurant] = useState({ name: '', url: '' })
  let history = useHistory()
  let params = useParams()

  useEffect(() => {
    const findRestaurant = async () => {
      const fetchedRestaurant = await restaurantService.getOneById(params.id)
      if (fetchedRestaurant) {
        setRestaurant(fetchedRestaurant)
        setName(fetchedRestaurant.name)
        setUrl(fetchedRestaurant.url)
      }
    }

    findRestaurant()
  }, [params, restaurantService])

  const saveRestaurant = async (event) => {
    event.preventDefault()

    // TODO: CLEANUP
    if (name && url) {
      if (restaurant.id) {
        try {
          await restaurantService.update(restaurant)
          setName('')
          setUrl('')
          setError('')
          history.push('/')
        } catch (e) {
          setError(e.response.data.error)
        }
      } else {
        try {
          await restaurantService.add({ name, url })
          setName('')
          setUrl('')
          setError('')
          history.push('/')
        } catch (e) {
          setError(e.response.data.error)
        }
      }
    } else {
      setError('Name and/or URL cannot be empty!')
    }
  }

  return (
    <div>
      {error ? <Alert data-testid='addForm-errorMessage' variant='danger'>{error}</Alert> : null}
      <Form data-testid='addForm' onSubmit={(event) => saveRestaurant(event)} className='add-form'>
        <Form.Group>
          <Form.Label>Restaurant Name</Form.Label>
          <Form.Control
            data-testid='addForm-nameField'
            type='text'
            value={restaurant.name}
            onChange={(event) => setName(event.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Restaurant Website</Form.Label>
          <Form.Control
            data-testid='addForm-urlField'
            type='text'
            value={restaurant.url}
            onChange={(event) => setUrl(event.target.value)} />
        </Form.Group>

        <ButtonToolbar>
          <Button
            data-testid='addForm-cancelButton'
            onClick={() => history.push('/')}
            variant='secondary'
          >
            Cancel
          </Button>
          <Button
            data-testid='addForm-addButton'
            type='submit'
            variant='primary'
          >
            {restaurant.name ? 'Update' : 'App'}
          </Button>
        </ButtonToolbar>
      </Form>
    </div>
  )
}

AddForm.propTypes = {
  restaurantService: PropTypes.shape({
    add: PropTypes.func.isRequired,
    getOneById: PropTypes.func.isRequired
  }).isRequired
}

export default AddForm
