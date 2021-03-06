import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'
import './FilterList.css'
const FilterList = ({ selected, onRemove, emptyMessage }) => {
  const removeHandler = (id) => (event) => {
    event.preventDefault()
    onRemove(id)
  }

  return (
    <div data-testid='filter-list' className='category-list'>
      {selected && selected.length > 0
        ? selected.map((category) =>
          <Badge
            className='entry'
            variant={category.name === 'Suomi' ? 'primary' : 'light'}
            data-testid='filter-listEntry'
            key={category.id}>
            <span>{category.name}</span>
            {onRemove && <button data-testid='filter-listEntry-deleteButton' onClick={removeHandler(category.id)}>×</button>}
          </Badge>
        )
        : <span data-testid='filter-emptyMessage'>{emptyMessage}</span>
      }
    </div>
  )
}

FilterList.propTypes = {
  emptyMessage: PropTypes.node.isRequired,
  selected: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  onRemove: PropTypes.func.isRequired,
}

export default FilterList
