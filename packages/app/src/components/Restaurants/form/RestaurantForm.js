import React, { useState } from 'react'
import { Form, Button, ButtonToolbar, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { HelpOutline } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'

import Filter from '../../Filter/Filter/Filter'
import RouteMap from '../../RouteMap/RouteMap'

import locationService from '../../../services/location'

import './RestaurantForm.css'

const RestaurantForm = ({ restaurant, setRestaurant, onSubmit, submitMessage = 'Suggest', suggestTooltip = 'Create suggestion' }) => {
  const { register, handleSubmit, errors } = useForm()
  const [validated, setValidated] = useState(false)
  const [error, setError] = useState()
  const setName = (name) => setRestaurant({ ...restaurant, name })
  const setUrl = (url) => setRestaurant({ ...restaurant, url })
  const setCategories = (categories) => setRestaurant({ ...restaurant, categories })

  let history = useHistory()

  const handleAddressChange = (address) => {
    setRestaurant({ ...restaurant, address, coordinates: undefined, showMap:false })
    setValidated(false)
  }

  const checkAddress = async () => {
    try {
      const coordinates = await locationService.getCoordinates(restaurant.address)
      const distance = await locationService.getDistance(coordinates.latitude, coordinates.longitude)
      setRestaurant({ ...restaurant, distance, coordinates, showMap: true })
      setValidated(true)
      setError()
    } catch (error) {
      setError('Could not find that location or address.')
      setRestaurant({ ...restaurant, coordinates: undefined, showMap:false })
      setValidated(false)
    }
  }

  const saveRestaurant = async (data, event) => {
    event.preventDefault()

    try {
      if (onSubmit) {
        delete restaurant.showMap
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

  const renderedError = error &&
    <Alert data-testid='error-msg-generic' variant='danger'>{error}</Alert>

  return (
    <div data-testid='restaurant-form'>
      {renderedError}
      {!restaurant
        ? 'Loading...'
        : <Form onSubmit={handleSubmit(saveRestaurant)} className='add-form'>
          <Form.Group data-testid='name-field'>
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

          <Form.Group data-testid='url-field'>
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
          <Form.Group data-testid='address-field'>
            <Form.Label>Restaurant Address</Form.Label>
            <Form.Control
              disabled={!restaurant}
              type='text'
              name='address'
              defaultValue={restaurant.address}
              onChange={(event) => handleAddressChange(event.target.value)}
            />
          </Form.Group>
          {restaurant.showMap && <RouteMap restaurant={restaurant} />}
          <Filter
            dropdownText='Categories'
            emptyMessage={<FilterEmptyMessage />} /* Private subcomponent - can be found below */
            filterCategories={restaurant.categories}
            setFilterCategories={setCategories} />
          <ButtonToolbar>
            <Button
              data-testid='cancel-button'
              onClick={() => history.push('/')}
              variant='secondary'
            >
              Cancel
            </Button>
            <Button
              data-testid='check-button'
              onClick={checkAddress}
              variant='success'
            >
              Check
            </Button>
            <OverlayTrigger
              placement='right'
              overlay={
                <Tooltip >
                  {suggestTooltip}
                </Tooltip>
              }
            >
              <Button
                data-testid='submit-button'
                type='submit'
                variant='primary'
                disabled={!validated}
              >
                {submitMessage}
              </Button>
            </OverlayTrigger>
          </ButtonToolbar>
        </Form>}
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
        <HelpOutline />
      </OverlayTrigger>
    </div>
  )
}

RestaurantForm.propTypes = {
  restaurant: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    categories: PropTypes.array,
    address: PropTypes.string,
    coordinates: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired
    }),
    showMap: PropTypes.bool.isRequired
  }),
  onSubmit: PropTypes.func,
  setRestaurant: PropTypes.func.isRequired,
  suggestTooltip: PropTypes.string,
  submitMessage: PropTypes.string,
}

export default RestaurantForm
