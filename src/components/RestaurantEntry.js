import React from 'react'
import { Button, Card } from 'react-bootstrap'
import restaurantService from '../services/restaurant'
import './RestaurantEntry.css'

const RestaurantEntry = ({ restaurant, onRemove }) => {
  const handleRemove = async (event) => {
    event.preventDefault()

    await onRemove(restaurant)
  }

  return (
    <Card className='restaurant-entry' data-testid='restaurantList-restaurantEntry'>
      <Card.Body>
        <span data-testid='restaurantEntry-name'>{restaurant.name}</span>
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

export default RestaurantEntry
