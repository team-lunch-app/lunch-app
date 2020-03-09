import React from 'react'
import { Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './ListEntry.css'
import authService from '../../services/authentication'


const ListEntry = ({ item, onClickRemove, onClickEdit }) => {
  const token = authService.getToken()
  const isLoggedIn = token !== undefined

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
    <OverlayTrigger
      placement='right'
      overlay={
        <Tooltip >
          {!isLoggedIn ? ('Send a suggestion to remove ' + item.name) : 'Remove ' + item.name + ' permanently'}
        </Tooltip>
      }
    >
      <Button
        role='remove-button'
        onClick={handleClickRemove}
        variant='danger'
        size='sm'
      >
        {!isLoggedIn ? 'Suggest removal' : 'Remove '}
      </Button>
    </OverlayTrigger>

  return (
    <Card className='list-entry' data-testid='list-entry'>
      <Card.Body>
        <span data-testid='label'>{item.name}</span>
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
