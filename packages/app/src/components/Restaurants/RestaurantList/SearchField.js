import React from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'
import PropTypes from 'prop-types'

import './SearchField.css'

const SearchField = ({ handleSearchStringChange, searchString }) => {

  return (
    <InputGroup className='search-field' data-testid='search-field'>
      <FormControl
        placeholder='Search'
        onChange={handleSearchStringChange}
        value={searchString}
        data-testid='input-field'
      />
    </InputGroup>
  )
}

SearchField.propTypes = {
  handleSearchStringChange: PropTypes.func.isRequired,
  searchString: PropTypes.string.isRequired
}

export default SearchField
