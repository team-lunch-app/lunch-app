import React from 'react'
import { Card } from 'react-bootstrap'
import PropTypes from 'prop-types'

import AutocompleteEntry from '../AutocompleteEntry/AutocompleteEntry'

import './AutocompleteList.css'

const AutocompleteList = ({ suggestions, handleClick }) => {
  return (
    <Card data-testid='autocomplete-list' className="autocompletelist">
      {suggestions.map(suggestion => <AutocompleteEntry key={suggestion.placeId} suggestion={suggestion} handleClick={handleClick} />)}
    </Card>
  )
}

AutocompleteList.propTypes = {
  suggestions: PropTypes.array.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default AutocompleteList
