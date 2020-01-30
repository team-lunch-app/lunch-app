import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'react-bootstrap'
//import categoryService from '../services/category'

const FilterDropdown = ({ onAdd }) => {
  const [categories, setCategories] = useState([{ id: 1, name: 'pizza' }, { id: 2, name: 'burger' }, { id: 3, name: 'salads' }])

  return (
    <>
      <Dropdown data-testid='filter-dropdown'>
        <Dropdown.Toggle>Select</Dropdown.Toggle>
        <Dropdown.Menu> {categories.map((category) =>
          <Dropdown.Item data-testid='filter-dropdownEntry' key={category.id}>
            {category.name}
          </Dropdown.Item>
        )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

FilterDropdown.propTypes = {
  onAdd: PropTypes.func.isRequired
}

export default FilterDropdown
