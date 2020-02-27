import React, { useState, useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import categoryService from '../../../services/category'
import PropTypes from 'prop-types'

const CategoryDropdown = ({ text, selected, onAdd, onRemove }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    categoryService
      .getAll()
      .then(fetched => setCategories([...fetched]))
  }, [])

  const isActive = category => selected.map(c => c.id).includes(category.id)

  return (
    <Dropdown
      data-testid='category-dropdown'
      show={dropdownOpen}
      onSelect={(eventKey) => {
        const clicked = categories.find(c => `${c.id}` === `${eventKey}`)

        if (isActive(clicked)) {
          onRemove(clicked.id)
        } else {
          onAdd(clicked)
        }
      }}
      onToggle={(isOpen, event, { source }) => {
        setDropdownOpen(source !== 'select' ? isOpen : dropdownOpen)
      }}
    >
      <Dropdown.Toggle data-testid='category-dropdown-toggle' id="dropdown-custom-1">
        {text || 'Filter by'}
      </Dropdown.Toggle>
      <Dropdown.Menu >
        {categories
          ? categories.map(category =>
            <Dropdown.Item
              eventKey={category.id}
              key={category.id}
              active={isActive(category)}
            >
              <span data-testid='category-dropdown-entry'>
                {category.name}
              </span>
            </Dropdown.Item>)
          : <Dropdown.Item>Loading...</Dropdown.Item>
        }
      </Dropdown.Menu>
    </Dropdown>
  )
}

CategoryDropdown.propTypes = {
  text: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

export default CategoryDropdown
