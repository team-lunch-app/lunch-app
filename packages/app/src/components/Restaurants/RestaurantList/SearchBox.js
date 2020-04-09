import React from 'react'
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

export default SearchBox
