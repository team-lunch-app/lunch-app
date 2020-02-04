import React, { useState, useEffect } from 'react'
import { Form, Button, ButtonToolbar, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import restaurantService from '../services/restaurant'

import './AddForm.css'
import Filter from './Filter'

const AddForm = ({ id, onSubmit }) => {
  const createDefaultRestaurant = () => ({ name: '', url: '', categories: [] })

  const [error, setError] = useState('')
  const [restaurant, setRestaurant] = useState(!id ? createDefaultRestaurant() : undefined)
  const setName = (name) => setRestaurant({ ...restaurant, name })
  const setUrl = (url) => setRestaurant({ ...restaurant, url })
  const setCategories = (categories) => setRestaurant({ ...restaurant, categories })

  let history = useHistory()

  useEffect(() => {
    if (id) {
      restaurantService
        .getOneById(id)
        .then(fetched => setRestaurant({
          ...fetched,
          name: fetched.name || '',
          url: fetched.url || '',
          categories: fetched.categories || [],
        }))
        .catch(() => {
          setError('Could not find restaurant with given ID')
          setRestaurant(createDefaultRestaurant())
        })
    }
  }, [id])

  const saveRestaurant = async (event) => {
    event.preventDefault()

    if (restaurant.name.trim().length === 0 || restaurant.url.trim().length === 0) {
      setError('Name and/or URL cannot be empty!')
      return
    }

    try {
      if (onSubmit) {
        await onSubmit({
          ...restaurant,
          categories: restaurant.categories.map(category => category.id)
        })
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
            disabled={!restaurant}
            data-testid='addForm-nameField'
            type='text'
            value={!restaurant ? 'Loading...' : restaurant.name}
            onChange={(event) => setName(event.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Restaurant Website</Form.Label>
          <Form.Control
            disabled={!restaurant}
            data-testid='addForm-urlField'
            type='text'
            value={!restaurant ? 'Loading...' : restaurant.url}
            onChange={(event) => setUrl(event.target.value)} />
        </Form.Group>
        <Filter
          dropdownText='Categories'
          emptyMessage={<FilterEmptyMessage />} /* Private subcomponent - can be found below */
          filterCategories={!restaurant ? [] : restaurant.categories}
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
            {id ? 'Update' : 'Add'}
          </Button>
        </ButtonToolbar>
      </Form>
    </div>
  )
}

const FilterEmptyMessage = () => {
  return (
    <div className='empty-message'>
      <Alert variant='danger'><span>Please select at least one! </span>

      </Alert>
      <OverlayTrigger
        placement='right'
        overlay={
          <Tooltip>
            Selecting categories will make this restaurant show up in filtered draws.
          </Tooltip>
        }
      >
        <FontAwesomeIcon className='question-mark' icon={faQuestionCircle} />
      </OverlayTrigger>
    </div>
  )
}

AddForm.propTypes = {
  id: PropTypes.any,
  onSubmit: PropTypes.func,
}

export default AddForm
