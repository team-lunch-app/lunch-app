import React, { useState, useEffect } from 'react'
import { Form, Button, ButtonToolbar, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import restaurantService from '../services/restaurant'

import './AddForm.css'
import Filter from './Filter'

const AddForm = ({ id }) => {
  const createDefaultRestaurant = () => ({ name: '', url: '', categories: [] })

  const [error, setError] = useState('')
  const [restaurant, setRestaurant] = useState(!id ? createDefaultRestaurant() : undefined)
  let history = useHistory()

  useEffect(() => {
    if (id) {
      restaurantService
        .getOneById(id)
        .then(fetched => setRestaurant(fetched))
        .catch(() => {
          setError('Could not find restaurant with given ID')
          setRestaurant(createDefaultRestaurant())
        })
    }
  }, [id])

  if (id && !restaurant) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  const setName = (name) => setRestaurant({ ...restaurant, name })
  const setUrl = (url) => setRestaurant({ ...restaurant, url })
  const setCategories = (categories) => setRestaurant({ ...restaurant, categories })

  const saveRestaurant = async (event) => {
    event.preventDefault()

    if (restaurant.name.trim().length === 0 || restaurant.url.trim().length === 0) {
      setError('Name and/or URL cannot be empty!')
      return
    }

    try {
      if (id) {
        await restaurantService.update(restaurant)
      } else {
        await restaurantService.add(restaurant)
      }
      setError('')
      history.push('/')
    }
    catch (e) {
      setError(e.response.data.error)
    }
  }

  return (
    <div data-testid='addForm'>
      {error ? <Alert data-testid='addForm-errorMessage' variant='danger'>{error}</Alert> : null}
      <Form onSubmit={(event) => saveRestaurant(event)} className='add-form'>
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
        <Filter
          dropdownText='Categories'
          emptyMessage={<Alert variant='danger'>Select at least one!</Alert>}
          filterCategories={restaurant.categories}
          setFilterCategories={setCategories} />
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
            {restaurant ? 'Update' : 'Add'}
          </Button>
        </ButtonToolbar>
      </Form>
    </div>
  )
}

AddForm.propTypes = {
  id: PropTypes.any,
}

export default AddForm
