import React from 'react'
import { Button, Card } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './ListEntry.css'

const ListEntry = ({ item, onClickRemove, onClickEdit }) => {
  const handleClickRemove = async (event) => {
    event.preventDefault()
    await onClickRemove(item)
  }

  const handleClickEdit = async (event) => {
    event.preventDefault()
    await onClickEdit(item)
  }

  const editButton = onClickEdit &&
    <Button
      role='edit-button'
      onClick={handleClickEdit}
      variant='warning'
      size='sm'
    >
      Edit
    </Button>

  const removeButton = onClickRemove &&
    <Button
      role='remove-button'
      onClick={handleClickRemove}
      variant='danger'
      size='sm'
    >
      Remove
    </Button>


  return (
    <Card className='list-entry' data-testid='list-entry'>
      <Card.Body>
        <span role='label'>{item.name}</span>
        <div className='buttons'>
          {editButton}
          {removeButton}
        </div>
      </Card.Body>
    </Card>
  )
}

ListEntry.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onClickRemove: PropTypes.func,
  onClickEdit: PropTypes.func
}

export default ListEntry
