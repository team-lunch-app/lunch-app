import React, { useState, useEffect } from 'react'
import { Form, Button, ButtonToolbar, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { HelpOutline } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import Filter from '../../Filter/Filter/Filter'
import RouteMap from '../../RouteMap/RouteMap'
import AutocompleteList from '../AutocompleteList/AutocompleteList'

import locationService from '../../../services/location'
import placeService from '../../../services/places'

import './RestaurantForm.css'

const RestaurantForm = ({ restaurant, setRestaurant, onSubmit, submitMessage = 'Suggest', suggestTooltip = 'Create suggestion', autocompleteDelay = 1000 }) => {
  const [validated, setValidated] = useState((restaurant.coordinates !== undefined))
  const [errors, setErrors] = useState({})
  const setCategories = (categories) => setRestaurant({ ...restaurant, categories })
  const [timeoutHandle, setTimeoutHandle] = useState()
  const [blurTimeout, setBlurTimeout] = useState()
  const [suggestions, setSuggestions] = useState([])
  const [focusedId, setFocusedId] = useState()

  let history = useHistory()

  useEffect(() => {
    return () => {
      clearTimeout(blurTimeout)
      clearTimeout(timeoutHandle)
    }
  }, [timeoutHandle, blurTimeout])

  const handleAddressChange = (address) => {
    setRestaurant({ ...restaurant, address, coordinates: undefined })
    setValidated(false)
  }

  const handleUrlChange = (url) => {
    setRestaurant({ ...restaurant, url })
    setErrors({ ...errors, url: undefined })
  }

  const fetchSuggestions = async (name) => {
    const fetched = await placeService.getSuggestions(name)
    setSuggestions(fetched)
  }

  const handleNameChange = (name) => {
    setRestaurant({
      ...restaurant,
      name,
      placeId: undefined
    })
    setErrors({ ...errors, name: undefined })
    clearTimeout(timeoutHandle)
    setTimeoutHandle((setTimeout(() => {
      name
        ? fetchSuggestions(name)
        : setSuggestions()
    }, autocompleteDelay)))
  }

  const fetchRestaurant = async (suggestion) => {
    try {
      const fetchedRestaurant = await placeService.getRestaurant(suggestion.placeId)
      clearTimeout(timeoutHandle)
      setSuggestions()
      setRestaurant({
        ...restaurant,
        url: fetchedRestaurant.website || '',
        name: fetchedRestaurant.name,
        address: fetchedRestaurant.formatted_address,
        placeId: fetchedRestaurant.place_id,
        coordinates: {
          latitude: fetchedRestaurant.geometry.location.lat,
          longitude: fetchedRestaurant.geometry.location.lng
        },
        distance: suggestion.distance
      })
      setValidated(true)
      setErrors({})
    } catch (error) {
      setErrors({ ...errors, general: error })
      setValidated(false)
    }
  }

  const checkAddress = async () => {
    try {
      const coordinates = await locationService.getCoordinates(restaurant.address)
      const distance = await locationService.getDistance(coordinates.latitude, coordinates.longitude)
      setRestaurant({ ...restaurant, distance, coordinates })
      setValidated(true)
      setErrors({ ...errors, address: undefined })
    } catch (error) {
      setErrors({ ...errors, address: 'Could not find that location or address.' })
      setRestaurant({ ...restaurant, coordinates: undefined })
      setValidated(false)
    }
  }

  const handleSubmit = (event, callback) => {
    event.preventDefault()
    let accepted = true
    let nameError = undefined
    let urlError = undefined
    if (!restaurant.name || restaurant.name.length < 3 || restaurant.name.length > 240) {
      nameError = 'The name needs to be between 3 and 240 characters'
      accepted = false
    }
    if (restaurant.url && (restaurant.url.length < 3 || restaurant.url.length > 240)) {
      urlError = 'The website url needs to be between 3 and 240 characters'
      accepted = false
    }
    setErrors({ ...errors, name: nameError, url: urlError })
    accepted && callback()
  }

  const saveRestaurant = async () => {
    try {
      if (onSubmit) {
        await onSubmit({
          ...restaurant,
          categories: restaurant.categories.map(category => category.id)
        })
      }
      setErrors({})
      history.push('/')
    }
    catch (e) {
      setErrors({ ...errors, general: e.response.data.error })
    }
  }

  const renderError = (err) => <Alert data-testid='error-msg-generic' variant='danger'>{String(err)}</Alert>

  return (
    <div data-testid='restaurant-form'>
      {errors.general && renderError(errors.general)}
      {!restaurant
        ? 'Loading...'
        : <Form onSubmit={(event) => handleSubmit(event, saveRestaurant)} className='add-form'>
          <Form.Group data-testid='name-field' className="name-field">
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control
              data-testid='name-input'
              role="textbox"
              id="nameinput"
              autoComplete="off"
              disabled={!restaurant}
              type='text'
              name='name'
              value={restaurant.name}
              onFocus={(event) => setFocusedId(event.target.id)}
              onBlur={() => setBlurTimeout(setTimeout(() => setFocusedId(undefined), 100))}
              onChange={(event) => handleNameChange(event.target.value)} />
            {(suggestions && suggestions.length > 0 && focusedId === 'nameinput') && <AutocompleteList suggestions={suggestions} handleClick={fetchRestaurant} />}
            {errors.name && renderError(errors.name)}
          </Form.Group>

          <Form.Group data-testid='url-field'>
            <Form.Label>Restaurant Website</Form.Label>
            <Form.Control
              disabled={!restaurant}
              type='text'
              name='url'
              value={restaurant.url}
              onChange={(event) => handleUrlChange(event.target.value)} />
            {errors.url && renderError(errors.url)}
          </Form.Group>

          <Form.Group data-testid='address-field'>
            <Form.Label>Restaurant Address</Form.Label>
            <div className="address-field">
              <Form.Control
                disabled={!restaurant}
                type='text'
                name='address'
                value={restaurant.address}
                onChange={(event) => handleAddressChange(event.target.value)}
              />
              {!validated &&
                <OverlayTrigger
                  placement='right'
                  overlay={
                    <Tooltip >
                      {'Check that the address can be found before uploading'}
                    </Tooltip>
                  }>
                  <Button
                    data-testid='check-button'
                    onClick={checkAddress}
                    variant='success'>
                    Check
                  </Button>
                </OverlayTrigger>
              }
            </div>
            {errors.address && renderError(errors.address)}
          </Form.Group>

          {restaurant.coordinates && <RouteMap restaurant={restaurant} />}

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
            <OverlayTrigger
              placement='right'
              overlay={
                <Tooltip >
                  {suggestTooltip}
                </Tooltip>
              }>
              <Button
                data-testid='submit-button'
                type='submit'
                variant='primary'
                disabled={!validated}>
                {submitMessage}
              </Button>
            </OverlayTrigger>
          </ButtonToolbar>
        </Form>}
    </div >
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
    })
  }),
  onSubmit: PropTypes.func,
  setRestaurant: PropTypes.func.isRequired,
  suggestTooltip: PropTypes.string,
  submitMessage: PropTypes.string,
  autocompleteDelay: PropTypes.number
}

export default RestaurantForm
