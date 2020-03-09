import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'react-bootstrap'
import "./FilterType.css"

const FilterType = ({ filterType, setFilterType }) => {
  return (
    <Dropdown

      data-testid='filtertype-dropdown'
      onSelect={(eventKey) => setFilterType(eventKey)}
    >
      <Dropdown.Toggle
        className="filtertype-dropdown"
        variant='secondary'
        data-testid='filtertype-dropdown-toggle'>
        {filterType}
      </Dropdown.Toggle>
      <Dropdown.Menu >
        <Dropdown.Item eventKey='some' data-testid='filtertype-dropdown-entry'>
          some
        </Dropdown.Item>
        <Dropdown.Item eventKey='all' data-testid='filtertype-dropdown-entry'>
          all
        </Dropdown.Item>
        <Dropdown.Item eventKey='none' data-testid='filtertype-dropdown-entry'>
          none
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown >
  )
}

FilterType.propTypes = {
  filterType: PropTypes.string.isRequired,
  setFilterType: PropTypes.func.isRequired
}

export default FilterType
