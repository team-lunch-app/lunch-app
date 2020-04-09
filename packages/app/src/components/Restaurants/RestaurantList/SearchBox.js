import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import Filter from '../../Filter/Filter/Filter'

const SearchBox = ({ searchString, setSearchString, filterCategories, setFilterCategories }) => {
  
  const handleSearchStringChange = (event) => {
    setSearchString(event.target.value)
  }

  return (
    <Form className='search-form'>
      <Form.Group className='search-field' data-testid='search-field' >
        <Form.Control
          placeholder='Search'
          onChange={handleSearchStringChange}
          value={searchString}
          data-testid='input-field'
        />
      </Form.Group>
      <Filter
        dropdownText='Categories'
        emptyMessage={'No categories selected'}
        filterCategories={filterCategories}
        setFilterCategories={setFilterCategories}
      />
    </Form>
  )
}

SearchBox.propTypes = {
  filterCategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  setFilterCategories: PropTypes.func.isRequired,
  searchString: PropTypes.string.isRequired,
  setSearchString: PropTypes.func.isRequired
}

export default SearchBox
