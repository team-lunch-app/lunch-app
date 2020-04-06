import React, { useState, useEffect } from 'react'
import List from '../List/List'
import { Button, Alert, Card, Table } from 'react-bootstrap'
import PropTypes from 'prop-types'
import suggestionService from '../../services/suggestion'
import restaurantService from '../../services/restaurant'
import categoryService from '../../services/category'
import { Link as LinkIcon } from '@material-ui/icons'

import './SuggestionList.css'

export const SuggestionList = () => {
  const [suggestions, setSuggestions] = useState()

  useEffect(() => {
    suggestionService.getAll().then(setSuggestions)
  }, [])

  const handleReject = async (suggestion) => {
    await suggestionService.reject(suggestion.id)
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id))
  }
  
  const handleApprove = async (suggestion) => {
    await suggestionService.approve(suggestion.id)
    setSuggestions(suggestions.filter(s => s.data.id !== suggestion.data.id))
  }

  return (
    <div data-testid='suggestionList' className="suggestionlist">
      <h1 data-testid='suggestionList-title' className='suggestionList-title'>Pending Suggestions</h1>
      <List
        entries={suggestions}
        renderNoEntries={() => <Alert data-testid='suggestionList-alertMessage' variant='warning'>Sorry, No suggestions available :C</Alert>}
        renderEntry={(suggestion) =>
          <SuggestionEntry
            key={suggestion.id}
            suggestion={suggestion}
            handleApprove={handleApprove}
            handleReject={handleReject}
          />}
      />
    </div>
  )
}

export const SuggestionEntry = ({ suggestion, handleApprove, handleReject }) => {
  const [restaurant, setRestaurant] = useState()
  const [updatedRestaurant, setUpdatedRestaurant] = useState()

  useEffect(() => {

    /* If the suggestion concerns an existing restaurant */
    if (suggestion.type === 'EDIT' || suggestion.type === 'REMOVE') {
      const findExistingRestaurant = async () => {
        const found = await restaurantService.getOneById(suggestion.data.id)
        setRestaurant(found)
      }

      findExistingRestaurant()
    }

    /**
    * The restaurant within the given suggestion contains a list of category ids.
    * To display the names of these categories, we need to fetch them
    * from the database.
    */

    const mapCategories = async () => {
      const categories = await categoryService.getAll()
      const suggestedCategories = categories.filter((c) => suggestion.data.categories.includes(c.id))
      suggestion.type === 'EDIT'
        ? setUpdatedRestaurant({ ...suggestion.data, categories: suggestedCategories })
        : setRestaurant({ ...suggestion.data, categories: suggestedCategories })
    }

    mapCategories()
  }, [suggestion])

  const formatCoords = (coordinates) => coordinates
    ? `${coordinates.latitude}, ${coordinates.longitude}`
    : 'N/A'

  return (
    <Card className='suggestion-entry' data-testid='suggestionList-entry'>
      <Card.Header data-testid='suggestionEntry-type' className={suggestion.type} >{suggestion.type}</Card.Header>
      {restaurant &&
        <>
          <Card.Body>
            <Card.Title data-testid='suggestionEntry-restaurantName' className="text-centered">{restaurant && restaurant.name}</Card.Title>
          </Card.Body>
          <Card.Body>
            <Table striped bordered responsive='sm' size='sm'>
              <thead>
                <tr>
                  <th>Attribute</th>
                  {updatedRestaurant ? <th>Current</th> : <th>Value</th>}
                  {updatedRestaurant &&
                    <th data-testid='suggestionEntry-updated-th'>Suggested</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{restaurant.name}</td>
                  {updatedRestaurant &&
                    <td data-testid='suggestionEntry-updated-restaurantName'>{updatedRestaurant.name}</td>}
                </tr>
                <tr>
                  <td>URL</td>
                  <td><a href={restaurant.url}><span>{restaurant.url} <LinkIcon /></span></a></td>
                  {updatedRestaurant &&
                    <td data-testid='suggestionEntry-updated-restaurantUrl'><a href={updatedRestaurant.url}><span>{updatedRestaurant.url} <LinkIcon /></span></a></td>}
                </tr>
                <tr>
                  <td>Categories</td>
                  <td>{restaurant.categories.map((category) => <span key={category.id}>{category.name}, </span>)}</td>
                  {updatedRestaurant &&
                    <td data-testid='suggestionEntry-updated-restaurantCategories'>{updatedRestaurant.categories.map((category) => <span key={category.id}>{category.name}, </span>)}</td>}
                </tr>
                <tr>
                  <td>Address</td>
                  <td>{restaurant.address}</td>
                  {updatedRestaurant &&
                    <td data-testid='suggestionEntry-updated-restaurantAddress'>{updatedRestaurant.address}</td>}
                </tr>
                <tr>
                  <td>Distance</td>
                  <td>{restaurant.distance}</td>
                  {updatedRestaurant &&
                    <td data-testid='suggestionEntry-updated-restaurantDistance'>{updatedRestaurant.distance}</td>}
                </tr>
                <tr>
                  <td>Coordinates</td>
                  <td>{formatCoords(restaurant.coordinates)}</td>
                  {updatedRestaurant &&
                    <td data-testid='suggestionEntry-updated-restaurantCoordinates'>{formatCoords(updatedRestaurant.coordinates)}</td>}
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </>
      }
      <Card.Body className='buttons'>
        <Button
          data-testid='suggestionEntry-approveButton'
          variant='primary'
          onClick={() => handleApprove(suggestion)}
          size='sm'
        >
          Approve
        </Button>
        <Button
          data-testid='suggestionEntry-rejectButton'
          variant='danger'
          onClick={() => handleReject(suggestion)}
          size='sm'
        >
          Reject
        </Button>
      </Card.Body>
    </Card>
  )
}

SuggestionList.propTypes = {
}

SuggestionEntry.propTypes = {
  suggestion: PropTypes.shape({
    id: PropTypes.any.isRequired,
    type: PropTypes.string.isRequired,
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string,
      id: PropTypes.any,
      categories: PropTypes.array
    }).isRequired
  }),
  handleApprove: PropTypes.any.isRequired,
  handleReject: PropTypes.any.isRequired,
}
