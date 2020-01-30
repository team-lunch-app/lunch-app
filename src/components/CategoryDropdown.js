import React, { useState, useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import categoryService from '../services/categoryServiceStub'

const CategoryDropdown = ({ selected, onAdd, onRemove }) => {
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
      show={dropdownOpen}
      onSelect = {(eventKey) => {
        const clicked = categories.find(c => c.id == eventKey)

        if (isActive(clicked)) {
          onRemove(clicked.id)
        } else {
          onAdd(clicked)
        }
      }}
      onToggle = {(isOpen, event, { source }) => {
        setDropdownOpen(source !== 'select' ? isOpen : dropdownOpen)
      }}
    >
      <Dropdown.Toggle data-testid='category-dropdown' id="dropdown-custom-1">Categories</Dropdown.Toggle>
      <Dropdown.Menu >
        {categories
          ? categories.map(category => 
            <Dropdown.Item 
              eventKey={category.id} 
              key={category.id}
              active={isActive(category)}
            >
              {category.name}
            </Dropdown.Item>)
          : <Dropdown.Item>Loading...</Dropdown.Item>
        }
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default CategoryDropdown
