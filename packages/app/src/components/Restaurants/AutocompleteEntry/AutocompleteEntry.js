import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

import PropTypes from 'prop-types'

import './AutocompleteEntry.css'

const AutocompleteEntry = ({ suggestion, handleClick }) => {
  return (
    <ListGroup data-testid='autocomplete-entry' className="list-group-flush">
      <ListGroupItem onClick={() => handleClick(suggestion)}> {suggestion.address} </ListGroupItem>
    </ListGroup>
  )
}

AutocompleteEntry.propTypes = {
  suggestion: PropTypes.shape({
    placeId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
  }),
  handleClick: PropTypes.func.isRequired
}

export default AutocompleteEntry
