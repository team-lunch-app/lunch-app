import React from 'react'
import { Button, Card } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import './RestaurantEntry.css'

const RestaurantEntry = ({ restaurant, onRemove }) => {
  let history = useHistory()

  const handleRemove = async (event) => {
    event.preventDefault()

    await onRemove(restaurant)
  }

  const handleEdit = (event) => {
    event.preventDefault()
    history.push(`/edit/${restaurant.id}`)
  }

  return (
    <Card className='restaurant-entry' data-testid='restaurantList-restaurantEntry'>
      <Card.Body>
        <span data-testid='restaurantEntry-name'>{restaurant.name}</span>
        <Button
          data-testid='restaurantEntry-editButton'
          onClick={handleEdit}
          variant='warning'
          size='sm'
        >
          Edit
        </Button>
        <Button
          data-testid='restaurantEntry-removeButton'
          onClick={handleRemove}
          variant='danger'
          size='sm'
        >
          Remove
        </Button>
      </Card.Body>
    </Card>
  )
}

RestaurantEntry.propTypes = {
  restaurant: PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onRemove: PropTypes.func
}

export default RestaurantEntry
