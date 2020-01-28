import React, { useState } from 'react'
import { Form, Button, ButtonToolbar, Alert, Dropdown } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import CategoryServiceStub from '../services/categoryServiceStub'

import './AddForm.css'

const AddForm = ({ restaurantService }) => {
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [categories, setCategories]  = useState([])
  let history = useHistory()

  const addRestaurant = async (event) => {
    event.preventDefault()

    if (name && url) {
      try {
        await restaurantService.add({ name, url })

        setName('')
        setUrl('')
        setError('')
        history.push('/')
      } catch (e) {
        setError(e.response.data.error)
      }
    } else {
      setError('Name and/or URL cannot be empty!')
    }
  }

  const addCategory = (event) => {
    event.preventDefault()
    console.log('event', event)
    setCategories(categories.concat(event.target.value))
    console.log('Kategoriat: ', categories)
  }

  return (
    <div>
      {error ? <Alert data-testid='addForm-errorMessage' variant='danger'>{error}</Alert> : null}
      <Form data-testid='addForm' onSubmit={(event) => addRestaurant(event)} className='add-form'>
        <Form.Group>
          <Form.Label>Restaurant Name</Form.Label>
          <Form.Control
            data-testid='addForm-nameField'
            type='text'
            value={name}
            onChange={(event) => setName(event.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Restaurant Website</Form.Label>
          <Form.Control
            data-testid='addForm-urlField'
            type='text'
            value={url}
            onChange={(event) => setUrl(event.target.value)} />
        </Form.Group>
        {categories.length !== 0 
          ? categories.map(category => <p key={'something'+category}>{category}</p>)
          : <p key="dummy"></p>
        }
        <Dropdown>
          <Dropdown.Toggle data-testid='category-dropdown' id="dropdown-custom-1">Categories</Dropdown.Toggle>
          <Dropdown.Menu >
            {CategoryServiceStub.getAll().map(category => <Dropdown.Item value={category} onClick={addCategory} key={category}> {category} </Dropdown.Item>)}
          </Dropdown.Menu>
        </Dropdown>

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
            Add
          </Button>
        </ButtonToolbar>
      </Form>
    </div>
  )
}

AddForm.propTypes = {
  restaurantService: PropTypes.shape({
    add: PropTypes.func.isRequired
  }).isRequired
}

export default AddForm
