import React from 'react'
import { Button, Card } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import './CategoryEntry.css'

const CategoryEntry = ({ category, onRemove }) => {
  let history = useHistory()

  const handleRemove = async (event) => {
    event.preventDefault()

    await onRemove(category)
  }

  const handleEdit = (event) => {
    event.preventDefault()
    history.push(`/admin/categories/edit/${category.id}`)
  }

  return (
    <Card className='category-entry' data-testid='categoryList-categoryEntry'>
      <Card.Body>
        <span data-testid='categoryEntry-name'>{category.name}</span>
        <div className='buttons'>
          <Button
            data-testid='categoryEntry-editButton'
            onClick={handleEdit}
            variant='warning'
            size='sm'
          >
            Edit
          </Button>
          <Button
            data-testid='categoryEntry-removeButton'
            onClick={handleRemove}
            variant='danger'
            size='sm'
          >
            Remove
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

CategoryEntry.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onRemove: PropTypes.func
}

export default CategoryEntry
