import React from 'react'
import PropTypes from 'prop-types'
import {Badge} from 'react-bootstrap'

const FilterList = ({ selected, onRemove }) => {
  const removeHandler = (id) => (event) => {
    event.preventDefault()
    onRemove(id)
  }

  return (
    <div data-testid='filter-list'>
      <span data-testid='filter-listLabel'> Filter by: </span>
      {selected.map((category) =>
        <Badge pill variant='light' data-testid='filter-listEntry' key={category.id}>
          {category.name}
          <button data-testid='filter-listEntry-deleteButton' onClick={removeHandler(category.id)}>X</button>
        </Badge>
      )}
    </div>
  )
}

FilterList.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  onRemove: PropTypes.func.isRequired
}

export default FilterList
