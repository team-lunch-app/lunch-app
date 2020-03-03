import React, { useState, useEffect } from 'react'
import { Form, Button, ButtonToolbar, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'

import restaurantService from '../../../services/restaurant'
import authService from '../../../services/authentication'
import locationService from "../../../services/location"

import './AddForm.css'
import Filter from '../../Filter/Filter/Filter'

const AddForm = ({ id, onSubmit }) => {
  const createDefaultRestaurant = () => ({ name: '', url: '', categories: [], address: '', coordinates: { latitude: 60, longitude: 24 }, distance: 1000 })

  const [error, setError] = useState('')
  const { register, handleSubmit, errors } = useForm()
  const [restaurant, setRestaurant] = useState(!id ? createDefaultRestaurant() : undefined)
  const [validated, setValidated] = useState(true)
  const setName = (name) => setRestaurant({ ...restaurant, name })
  const setUrl = (url) => setRestaurant({ ...restaurant, url })
  const setAddress = (address) => setRestaurant({ ...restaurant, address })
  const setCategories = (categories) => setRestaurant({ ...restaurant, categories })

  const token = authService.getToken()
  const isLoggedIn = token !== undefined
  let history = useHistory()

  useEffect(() => {
    if (id) {
      restaurantService
        .getOneById(id)
        .then(fetched => {
          console.log(fetched)
          setRestaurant({
            ...fetched,
            name: fetched.name || '',
            url: fetched.url || '',
            categories: fetched.categories || [],
          })
        })
        .catch(() => {
          setError('Could not find restaurant with the given ID')
          setRestaurant(createDefaultRestaurant())
        })
    }
  }, [id])

  const checkAddress = async (event) => {
    try {
      const coordinates = await locationService.getCoordinates(restaurant.address)
      const distance = await locationService.getDistance(coordinates.latitude, coordinates.longitude)
      setRestaurant({ ...restaurant, distance, coordinates })
      setValidated(true)
      setError()
    } catch (error) {
      console.log(error)
      setError("Could not find that location or address.")
      setValidated(false)
    }
  }

  const saveRestaurant = async (data, event) => {
    event.preventDefault()

    try {
      if (onSubmit) {
        console.log("Submitting", restaurant)
        await onSubmit({
          ...restaurant,
          categories: restaurant.categories.map(category => category.id)
        })
      }
      !isLoggedIn && window.alert('Your suggestion has been received. An admin will have to approve it.')
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
      {restaurant ?
        <Form onSubmit={handleSubmit(saveRestaurant)} className='add-form'>
          <Form.Group data-testid='addForm-nameField'>
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control
              disabled={!restaurant}
              type='text'
              name='name'
              defaultValue={restaurant.name}
              onChange={(event) => setName(event.target.value)}
              ref={register({ required: true, minLength: 3, maxLength: 240 })} />
            {errors.name &&
              <Alert variant='danger'>
                {errors.name.type === 'required' && <li>Name cannot be empty!</li>}
                {errors.name.type === 'minLength' && <li>Must be at least 3 characters</li>}
                {errors.name.type === 'maxLength' && <li>Must be shorter than 240 characters</li>}
              </Alert>
            }
          </Form.Group>

          <Form.Group data-testid='addForm-urlField'>
            <Form.Label>Restaurant Website</Form.Label>
            <Form.Control
              disabled={!restaurant}
              type='text'
              name='url'
              defaultValue={restaurant.url}
              onChange={(event) => setUrl(event.target.value)}
              ref={register({ required: true, minLength: 3, maxLength: 240 })} />
            {errors.url &&
              <Alert variant='danger'>
                {errors.url.type === 'required' && <li>URL cannot be empty!</li>}
                {errors.url.type === 'minLength' && <li>Must be at least 3 characters</li>}
                {errors.url.type === 'maxLength' && <li>Must be shorter than 240 characters</li>}
              </Alert>
            }
          </Form.Group>
          <Form.Group data-testid='addForm-addressField'>
            <Form.Label>Restaurant Address</Form.Label>
            <Form.Control
              disabled={!restaurant}
              type='text'
              name='address'
              defaultValue={restaurant.address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </Form.Group>
          <Filter
            dropdownText='Categories'
            emptyMessage={<FilterEmptyMessage />} /* Private subcomponent - can be found below */
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
              data-testid='addForm-checkButton'
              onClick={checkAddress}
              variant='success'
            >
              Check
            </Button>
            <div>
              <OverlayTrigger
                placement='right'
                overlay={
                  <Tooltip >
                    {!isLoggedIn ? (id ? 'Send a suggestion to edit this restaurant' : 'Send a suggestion to add this restaurant') : ''}
                  </Tooltip>
                }
              >
                <Button
                  data-testid='addForm-addButton'
                  type='submit'
                  variant='primary'
                  disabled={!validated}
                >
                  {!isLoggedIn ? 'Suggest' : (id ? 'Update' : 'Add')}
                </Button>
              </OverlayTrigger>
            </div>
          </ButtonToolbar>
        </Form>
        : 'Loading...'}
    </div>
  )
}

const FilterEmptyMessage = () => {
  return (
    <div className='empty-message'>
      <Alert variant='warning'><span>Please select at least one! </span>

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
